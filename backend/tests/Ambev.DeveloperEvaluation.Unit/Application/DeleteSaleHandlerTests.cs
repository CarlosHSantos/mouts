using Ambev.DeveloperEvaluation.Application.Sales.DeleteSale;
using Ambev.DeveloperEvaluation.Domain.Repositories;
using FluentAssertions;
using FluentValidation;
using NSubstitute;
using Xunit;

namespace Ambev.DeveloperEvaluation.Unit.Application
{
    public class DeleteSaleHandlerTests
    {
        private readonly ISaleRepository _saleRepository;
        private readonly DeleteSaleHandler _handler;

        public DeleteSaleHandlerTests()
        {
            _saleRepository = Substitute.For<ISaleRepository>();
            _handler = new DeleteSaleHandler(_saleRepository);
        }

        [Fact(DisplayName = "Given valid delete command When handling Then deletes sale and returns success")]
        public async Task Handle_ValidCommand_DeletesSale_ReturnsSuccess()
        {
            // Given
            var command = new DeleteSaleCommand { Id = Guid.NewGuid() };
            _saleRepository.DeleteAsync(command.Id, Arg.Any<CancellationToken>()).Returns(true);

            // When
            var result = await _handler.Handle(command, CancellationToken.None);

            // Then
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            await _saleRepository.Received(1).DeleteAsync(command.Id, Arg.Any<CancellationToken>());
        }

        [Fact(DisplayName = "Given invalid sale id When handling Then throws not found exception")]
        public async Task Handle_NonexistentSale_ThrowsKeyNotFound()
        {
            // Given
            var command = new DeleteSaleCommand { Id = Guid.NewGuid() };
            _saleRepository.DeleteAsync(command.Id, Arg.Any<CancellationToken>()).Returns(false);

            // When
            var act = () => _handler.Handle(command, CancellationToken.None);

            // Then
            await act.Should().ThrowAsync<KeyNotFoundException>();
            await _saleRepository.Received(1).DeleteAsync(command.Id, Arg.Any<CancellationToken>());
        }

        [Fact(DisplayName = "Given invalid command When handling Then throws validation exception")]
        public async Task Handle_InvalidCommand_ThrowsValidationException()
        {
            // Given
            var command = new DeleteSaleCommand { Id = Guid.Empty }; // Id inválido

            // When
            var act = () => _handler.Handle(command, CancellationToken.None);

            // Then
            await act.Should().ThrowAsync<ValidationException>();
            await _saleRepository.DidNotReceive().DeleteAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>());
        }
    }
}
