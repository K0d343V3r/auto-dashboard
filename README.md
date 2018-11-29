# Auto Dashboard

An application to create, edit, and display information dashboards.

##### Features:

- Ability to create unlimited number of dashboards.
- Automatic layout of dashboard tiles, based on number of selected data points (one data point per tile).
- User can influence tile layout by tagging specific data points as important (important tiles get more real estate).
- Tile content automatically determined based on data point type:
  - Numeric data points render as a gauge.
  - Boolean data points render as an on/off LED.
  - String data points render as plain text.
- In addition to specifying data points, user can configure dashboard to display (future):
  - Current (live) data for all data points.
  - Historical data for all data points.
  - Data at a point in time for all data points.
- When viewing historical data, all data points render as trend charts (future).
- Dashboard data refreshes at a user specified frequency (i.e. every X seconds) (future).

##### Implementation:

- Angular and Angular Material 7.
- Uses DataSimulator.Api and Dashboad.Api back-end services.
- NSwagStudio generated proxies for back-end service access.
- Custom routing with auxiliary outlets.
- Data resolvers for pre-fetching component data.
