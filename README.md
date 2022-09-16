# telekom-lock-screen-widget
iOS Lock Screen Widget showing used or available mobile data for a Telekom contract. Works for fraenk and Congstar as well.

<img src="https://user-images.githubusercontent.com/8177259/190778770-99cf36cf-da15-40c2-b546-4be85fdac0e2.jpg" width="420"/>

Thank you, [@simonbs](https://twitter.com/simonbs) for the app [Scriptable](https://scriptable.app).

## Configuration

You can configure the provider logo and the type of data shown by setting the widgets parameter to `<provider>;<data>`. Valid values for the provider are `telekom`, `congstar` or `fraenk`. The shwon data can be either `available` or `used`.

<img src="https://user-images.githubusercontent.com/8177259/190785111-eb4a5b0c-8043-4a1e-91ef-cc666de048ea.jpg" width="210"/>
<img src="https://user-images.githubusercontent.com/8177259/190780754-2706e50d-1f7f-4cb0-bf29-cb60c8239f8d.jpg" width="210"/>
<img src="https://user-images.githubusercontent.com/8177259/190790402-a634daf6-6a7e-4fca-bdf7-d9d966d0f06b.jpg" width="210"/>

## API not available

When you're connected via WiFi, the Telekom API will not be accessible. The widget caches the data and can still show the last known value fetched via mobile data. It will be greyed out to indicate cached data.

<img src="https://user-images.githubusercontent.com/8177259/190792995-db1bd722-799e-4126-82c3-d783c29c9c07.jpg" width="210"/>
<img src="https://user-images.githubusercontent.com/8177259/190793061-3163beb5-7a19-41ca-859e-7baaa09f8e46.jpg" width="210"/>

For this to work, you have to run the widget's script while NOT connected to a WiFi on the first run.

## Requirements

- iOS 16 or later
- [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188) app with lock screen widget support (>= 1.7 188)
