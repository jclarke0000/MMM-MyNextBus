# MMM-MyNextBus

This a module for [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop).

This shows you upcoming vehicle arrival times for any transit agency supported by NextBus.


## Installation
1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/jclarke0000/MMM-MyNextBus.git`.
2. Enter the new `MMM-MyNextBus` directory and execute `npm install`.

## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>agency</code></td>
      <td><strong>REQUIRED</strong> The transit agency tag.<br><br><strong>Type</strong> <code>String</code><br />See below for more instructions on configuring your `agency`.</td>
    </tr>
    <tr>
      <td><code>routeList</code></td>
      <td><strong>REQUIRED</strong> An array of route tag and stop tag pairs.<br><br><strong>Type</strong> <code>Array</code><br />See below for more instructions on configuring your `routeList`.</td>
    </tr>
    <tr>
      <td><code>updateInterval</code></td>
      <td>How frequently in milliseconds to poll for data from TTC's public API.<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>60000</code> (i.e.: 1 minute)</td>
    </tr>
  </tbody>
</table>

## Detailed Configuration instructions

### Transit Agency

Go here for the list of agencies supported by NextBus:
http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList

Find the agency you'd like, and copy the `tag` value into your config file.  e.g. `agency : 'ttc'`

### Route List

Each entry in your `routeList` consists of a route tag and stop tag.  In all of the URL examples below, you'll need to replace the `a=ttc` parameter with your agency.  (e.g.: `a=rutgers`)

First determine which routes you're interested in (e.g.: `501` for the Queen St. streetcar). The full list of routes are listed here:
http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc

Next, got to `http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=501`.  Replace the parameter `r=501` in the URL
with whatever route you're interested in.  Determine which stop you want to see arrival times for. Usually this will be the one you
normally go to to wait for your bus or streetcar.  You'll need the value in the `tag` parameter, for example `2332`, as found in this line:

`<stop tag="2332" title="Queen St East At Yonge St (Queen Station)" lat="43.6525499" lon="-79.37909" stopId="3079"/>`

It's not explicitly listed whether the stop is for a particular direction on the route, but they are listed in order, and if you are familiar
with the route you should be able to figure out the right stop tag.

At bare minimum you need one entry, with two properties:

* `routeNo` - the route tag from the first step above
* `stop` - the stop tag along the route.

You can test that you have the right combination by going to:
`http://webservices.nextbus.com/service/publicXMLFeed?&command=predictionsForMultiStops&a=ttc&stops=501|2332`.  Replace the `stops` parameter
at the end of the URL with the route tag and stop tag separater by the pipe `|` character.

Repeat for as many stops and routes as you would like.

Your config should something like this:

```
{
  module: 'MMM-MyNextBus',
  position: 'top_left',
  header: 'TTC Schedule',
  config: {
    agency: 'ttc',
    routeList: [
      {
        routeNo : '501',
        stop : '6108'
      },
      {
        routeNo : '501',
        stop : '2332'
      },
      {
        routeNo : '301',
        stop : '2332',
      },
      {
        routeNo : '143',
        stop: '1148'
      },
      {
        routeNo : '64',
        stop : '9055'
      }
    ]
  }
},
```

By default, each entry in your route list will use the `bus` icon.  You can specify one of four icons to use for each route:
`bus`, `tram`, `subway`, or `train`.

```
{
  module: 'MMM-MyNextBus',
  position: 'top_left',
  header: 'TTC Schedule',
  config: {
    agency: 'ttc',
    routeList: [
      {
        routeNo : '501',
        stop : '6108',
        icon: 'tram'
      },
      {
        routeNo : '501',
        stop : '2332',
        icon: 'tram',
      },
      {
        routeNo : '301',
        stop : '2332',
        //no icon specified.  defaults to 'bus'
      },
      {
        routeNo : '143',
        stop: '1148',
        icon: 'train'
      },
      {
        routeNo : '64',
        stop : '9055',
        icon: 'subway'
      }
    ]
  }
},
```

You'll notice above that I have two entries for the `501` route, but with different stops.  I've done this to monitor both eastbound and westbound
cars passing through the same intersection.  If you leave this as-is, both entries will have the same title, as they are for the same route, just
different directions. Therefore you can specify an additional parameter for a given entry to override the label.  

For example:

```
{
  module: 'MMM-MyNextBus',
  position: 'top_left',
  header: 'TTC Schedule',
  config: {
    agency: 'ttc',
    routeList: [
      {
        routeNo : '501',
        stop : '6108',
        icon: 'tram',        
        label : 'Queen Westbound'
      },
      {
        routeNo : '501',
        stop : '2332',
        icon: 'tram',        
        label : 'Queen Eastbound'
      },
      {
        routeNo : '301',
        stop : '2332',
      },
      {
        routeNo : '143',
        stop: '1148',
        icon: 'train'        
      },
      {
        routeNo : '64',
        stop : '9055',
        icon: 'subway'        
      }
    ]
  }
},
```

Finally, if you would like to colour code your entries, you can specify an optional parameter 'color' that will give the route tag whatever
color scheme you specify in hexadecimal format.  You can specify any or all of `borderColor`, `backgroundColor`, and `textColor`. e.g.:

```
{
  routeNo : '501',
  stop : '6108',
  icon: 'tram',
  label : 'Queen Westbound',
  color : {
    borderColor: "#FF0000",
    backgroundColor: "#FF0000",
    textColor: "#FFFFFF"
  }
},
```

Lastly, it should be noted that this module will hide a route entirely if there are no scheduled vehicles.  So if you're only seeing some of
your list entries, it's because that particular route isn't currently running, say because it's late at night or because the particular route
only operates during rush hour (e.g.: the downtown express routes).

