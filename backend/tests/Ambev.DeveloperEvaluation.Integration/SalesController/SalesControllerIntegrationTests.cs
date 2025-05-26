using Ambev.DeveloperEvaluation.WebApi.Features.Sales;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.CreateSale;
using Ambev.DeveloperEvaluation.WebApi.Features.Sales.GetSale;
using Ambev.DeveloperEvaluation.Application.Sales.GetSaleById;
using AutoMapper;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Xunit;
using Ambev.DeveloperEvaluation.WebApi.Common;
using MediatR;

public class SalesControllerUnitTests
{
    private readonly IMediator _mediator = Substitute.For<IMediator>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();
    private readonly SalesController _controller;

    public SalesControllerUnitTests()
    {
        _controller = new SalesController(_mediator, _mapper);
    }

    [Fact]
    public async Task GetSale_ValidId_ReturnsOkResult()
    {
        // Arrange
        var saleId = Guid.NewGuid();

        var query = new GetSaleByIdQuery { Id = saleId };

        // Resultado do domínio
        var queryResult = new GetSaleByIdResult
        {
            Id = saleId,
            SaleNumber = "SALE456",
            TotalAmount = 180.75m
        };

        // Resultado da WebApi (DTO)
        var expectedResponse = new GetSaleResponse
        {
            Id = queryResult.Id,
            SaleDate = DateTime.UtcNow,
            TotalAmount = queryResult.TotalAmount
        };

        // Setup dos mocks
        _mapper.Map<GetSaleByIdQuery>(saleId).Returns(query);
        _mediator.Send(query, Arg.Any<CancellationToken>()).Returns(Task.FromResult(queryResult));
        _mapper.Map<GetSaleResponse>(queryResult).Returns(expectedResponse);

        // Act
        var result = await _controller.GetSale(saleId, CancellationToken.None);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var apiResponse = Assert.IsType<ApiResponseWithData<GetSaleResponse>>(okResult.Value);
        Assert.True(apiResponse.Success);
        Assert.Equal("Sale retrieved successfully", apiResponse.Message);
        Assert.Equal(saleId, apiResponse.Data.Id);
    }


    [Fact]
    public async Task CreateSale_InvalidRequest_ReturnsBadRequest()
    {
        // Arrange
        var request = new CreateSaleRequest();
        var invalidValidator = Substitute.For<CreateSaleRequestValidator>();
        var validationResult = new ValidationResult(new[]
        {
            new ValidationFailure("SaleNumber", "SaleNumber is required")
        });
        invalidValidator.ValidateAsync(request, Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(validationResult));

        // Act
        var result = await _controller.CreateSale(request, CancellationToken.None);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        var errors = Assert.IsAssignableFrom<IEnumerable<ValidationFailure>>(badRequestResult.Value);
    }
}
