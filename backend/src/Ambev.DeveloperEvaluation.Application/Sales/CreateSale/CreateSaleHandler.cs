using Ambev.DeveloperEvaluation.Application.Infrastructure.Interface;
using Ambev.DeveloperEvaluation.Application.Sales.Events;
using Ambev.DeveloperEvaluation.Domain.Repositories;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Ambev.DeveloperEvaluation.Application.Sales.CreateSale
{
    /// <summary>
    /// Handles the creation of a new Sale.
    /// </summary>
    public class CreateSaleHandler : IRequestHandler<CreateSaleCommand, CreateSaleResult>
    {
        private readonly ISaleRepository _saleRepository;
        private readonly IMapper _mapper;
        private readonly IKafkaProducer _kafkaProducer;
        private readonly ILogger<CreateSaleHandler> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="CreateSaleHandler"/> class.
        /// </summary>
        /// <param name="saleRepository">The sale repository to persist sales.</param>
        /// <param name="mapper">The AutoMapper instance to map between objects.</param>
        /// <param name="kafkaProducer">The Kafka producer to publish events.</param>
        /// <param name="logger">The logger instance for logging information.</param>
        public CreateSaleHandler(
            ISaleRepository saleRepository,
            IMapper mapper,
            IKafkaProducer kafkaProducer,
            ILogger<CreateSaleHandler> logger)
        {
            _saleRepository = saleRepository;
            _mapper = mapper;
            _kafkaProducer = kafkaProducer;
            _logger = logger;
        }

        /// <summary>
        /// Handles the creation of a sale by processing the command.
        /// </summary>
        /// <param name="command">The command containing the sale creation data.</param>
        /// <param name="cancellationToken">Cancellation token to cancel operation.</param>
        /// <returns>The result of the created sale.</returns>
        /// <exception cref="ValidationException">Thrown when the command validation fails.</exception>
        public async Task<CreateSaleResult> Handle(CreateSaleCommand command, CancellationToken cancellationToken)
        {
            var validator = new CreateSaleCommandValidator();
            var validationResult = await validator.ValidateAsync(command, cancellationToken);

            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var sale = _mapper.Map<Sale>(command);

            sale.ApplyDiscountRules();

            var createdSale = await _saleRepository.CreateAsync(sale, cancellationToken);

            _logger.LogInformation("Event: SaleCreated | SaleId: {SaleId}", createdSale.Id);

            await _kafkaProducer.PublishAsync("sale-created", new SaleCreatedEvent(
                createdSale.Id,
                createdSale.Customer,
                createdSale.TotalAmount,
                createdSale.SaleDate
            ));

            return _mapper.Map<CreateSaleResult>(createdSale);
        }
    }
}
