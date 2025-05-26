using AutoMapper;
using MediatR;
using FluentValidation;
using Ambev.DeveloperEvaluation.Domain.Repositories;
using Ambev.DeveloperEvaluation.Application.Sales.Events;
using Ambev.DeveloperEvaluation.Application.Infrastructure.Interface;

namespace Ambev.DeveloperEvaluation.Application.Sales.UpdateSale
{
    /// <summary>
    /// Handles the update of a sale, including validation, updating the repository, 
    /// and publishing related events to Kafka.
    /// </summary>
    public class UpdateSaleHandler : IRequestHandler<UpdateSaleCommand, UpdateSaleResult>
    {
        private readonly ISaleRepository _saleRepository;
        private readonly IMapper _mapper;
        private readonly IKafkaProducer _kafkaProducer;

        /// <summary>
        /// Initializes a new instance of the <see cref="UpdateSaleHandler"/> class.
        /// </summary>
        /// <param name="saleRepository">Repository to access sales data.</param>
        /// <param name="mapper">AutoMapper instance for object mapping.</param>
        /// <param name="kafkaProducer">Kafka producer to publish domain events.</param>
        public UpdateSaleHandler(ISaleRepository saleRepository, IMapper mapper, IKafkaProducer kafkaProducer)
        {
            _saleRepository = saleRepository;
            _mapper = mapper;
            _kafkaProducer = kafkaProducer;
        }

        /// <summary>
        /// Handles the update sale command by validating input, updating the sale, 
        /// and publishing domain events to Kafka.
        /// </summary>
        /// <param name="command">The update sale command containing updated data.</param>
        /// <param name="cancellationToken">Token to observe cancellation requests.</param>
        /// <returns>The updated sale result.</returns>
        /// <exception cref="ValidationException">Thrown when validation fails.</exception>
        /// <exception cref="KeyNotFoundException">Thrown when the sale does not exist.</exception>
        public async Task<UpdateSaleResult> Handle(UpdateSaleCommand command, CancellationToken cancellationToken)
        {
            var validator = new UpdateSaleCommandValidator();
            var validation = await validator.ValidateAsync(command, cancellationToken);

            if (!validation.IsValid)
                throw new ValidationException(validation.Errors);

            var sale = await _saleRepository.GetByIdAsync(command.Id, cancellationToken);
            if (sale == null)
                throw new KeyNotFoundException("Sale not found");

            var cancelledSale = command.IsCancelled && !sale.IsCancelled;

            var cancelledItems = sale.Products
                .Where(p => command.Products.Any(cp => cp.Id == p.Id && cp.IsCancelled && !p.IsCancelled))
                .ToList();

            _mapper.Map(command, sale);

            // Do not remove products from the list, only update or insert
            foreach (var productCommand in command.Products)
            {
                var existingProduct = sale.Products.FirstOrDefault(p => p.Id == productCommand.Id);

                if (existingProduct != null)
                {
                    // Check if product changed from not cancelled to cancelled
                    if (!existingProduct.IsCancelled && productCommand.IsCancelled)
                    {
                        existingProduct.IsCancelled = true; // update status to cancelled
                    }

                    _mapper.Map(productCommand, existingProduct);
                }
                else
                {
                    var newProduct = _mapper.Map<SaleItem>(productCommand);
                    newProduct.Id = Guid.NewGuid();
                    newProduct.SaleId = sale.Id;

                    sale.Products.Add(newProduct);
                }
            }

            sale.ApplyDiscountRules();

            await _saleRepository.UpdateAsync(sale, cancellationToken);

            var saleModifiedEvent = new SaleModifiedEvent(sale.Id, DateTime.UtcNow);
            await _kafkaProducer.PublishAsync("sales-modified", saleModifiedEvent);

            if (cancelledSale)
            {
                var saleCancelledEvent = new SaleCancelledEvent(sale.Id, "Cancellation reason here");
                await _kafkaProducer.PublishAsync("sales-cancelled", saleCancelledEvent);
            }

            foreach (var cancelledItem in cancelledItems)
            {
                var itemCancelledEvent = new ItemCancelledEvent(cancelledItem.Id, sale.Id, cancelledItem.ProductName);
                await _kafkaProducer.PublishAsync("items-cancelled", itemCancelledEvent);
            }

            return _mapper.Map<UpdateSaleResult>(sale);
        }
    }
}
