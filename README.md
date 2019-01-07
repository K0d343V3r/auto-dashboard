# Auto Dashboard

An application to create, edit, and manage information dashboards.

##### Features:

- Ability to create unlimited number of dashboards.
- Automatic layout of dashboard tiles, based on number of selected data points (one data point per tile).
- User can influence tile layout by tagging specific data points as important (important tiles get more real estate).
- Tile content automatically determined based on requested time frame and data point type:
  - For data requests for a point in time (current or specific date/time):
    - Numeric data points render as a gauge.
    - Boolean data points render as an on/off LED.
    - String data points render as plain text.
  - For data requests over a period of time (time series), all data points render as line charts.
- Unlimited undo/redo support during dashboard editing.
- User can view static content (documents) along side time series data.
- User can change order of dashboards in dashboard selection list.
- Dashboard data refreshes at a user specified frequency (i.e. every X seconds) (future).

##### Implementation:

- Angular and Angular Material 7.
- Uses DataSimulator.Api and Dashboad.Api back-end services.
- NSwagStudio generated proxies for back-end service access.
- Custom routing with auxiliary outlets.
- Data resolvers for pre-fetching component data.
- Dynamically created child components.

##### Screenshots:

![Screenshot](screenshots/last5minutesreport.png)
![Screenshot](screenshots/currentvaluesreport.png)
![Screenshot](screenshots/editordatasettings.png)
![Screenshot](screenshots/editortimesettings.png)
