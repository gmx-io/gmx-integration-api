# Getting Started

To set up this project, you can use [create-next-app](https://nextjs.org/docs/pages/api-reference/create-next-app).

## GMX Integration API

This API provides integration for multiple chains that GMX is active on.

- Arbitrum integration: [https://gmx-integration-cg.vercel.app/api/arbitrum/pairs](https://gmx-integration-cg.vercel.app/api/arbitrum/pairs)
- Avalanche integration: [https://gmx-integration-cg.vercel.app/api/avalanche/pairs](https://gmx-integration-cg.vercel.app/api/avalanche/pairs)

## How to Use

To use this project, follow the steps below:

1. Install the dependencies:

```bash
yarn
```

2. Start the development server:

```bash
yarn dev
```

## API Specs

The API provides information about trading pairs. Each pair object contains the following information:

```json
{
  "ticker_id": "ETH_USD",
  "base_currency": "ETH",
  "target_currency": "USD",
  "product_type": "Perpetual",
  "last_price": 1868.5210971,
  "low": 1868.32,
  "high": 1914.118,
  "base_volume": 18773.171814193855,
  "target_volume": 35504179.22526789,
  "open_interest": 115411178.92925486
}

```

The `product_type` can be either `Spot` or `Perpetual`.