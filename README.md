To add a new visualization use the file ```MessengerVis.js```

Create a new single character element in the ```MENU_ITEMS``` global variable.

The component ```Visualization``` within ```MessengerVis.js``` has a switch statement for each menu item case, add your case and have it return your component
#### TODO: Replace character identifiers with something else linked to images


To add a visualization component follow ```MessagesPerPerson.js```

It takes in 1 prop, ```data``` which is the raw messages JSON data (found in ```props.data``` from the Visualization function)

Be sure to include the following line to ensure it does not fail upon no data:
```
if (this.props.data == null) {
    return null;
}
```
Return your ```react-vis``` or other visualization component wrapped in a ```<div></div>```