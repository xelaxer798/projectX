/*
    A higher order function that wraps a component with functionality
    that save's it's state to local storage. This means the components state
    will persist across page refreshes under the same domain and rules of localStorage.
*/


/*
    Global if localStorage is available on the system
*/

let hasLocalStorage = localStorage

if (hasLocalStorage) {
    let testKey = 'react-localstorage.hoc.test-key';
    try {
        // Access to global `localStorage` property must be guarded as it
        // fails under iOS private session mode.
        localStorage.setItem( testKey, 'foo' )
        localStorage.removeItem(testKey)
    } catch (e) {
        console.log("No local storage")
        hasLocalStorage = false;
    }
}


/*
    A HOC function that accepts a component and wraps it in another Component
    that saves it's state to local storage
*/

let WrapWithLocalStorage = Component => {

    // Return Component if no localStorage is available
    if( !hasLocalStorage ) return Component

    let name = Component.displayName || Component.constructor.displayName || Component.constructor.name

    class LocalStorageComponent extends Component {

        componentDidMount() {
            console.log("Bringing state back");
            this.hydrateStateWithLocalStorage();

            // add event listener to save state to localStorage
            // when user leaves/refreshes the page
            window.addEventListener(
                "beforeunload",
                this.saveStateToLocalStorage.bind(this)
            );
        }

        componentWillUnmount() {
            window.removeEventListener(
                "beforeunload",
                this.saveStateToLocalStorage.bind(this)
            );

            // saves if component has a chance to unmount
            this.saveStateToLocalStorage();
        }

        hydrateStateWithLocalStorage() {
            // for all items in state
            for (let key in this.state) {
                // if the key exists in localStorage
                if (localStorage.hasOwnProperty(key)) {
                    // get the key's value from localStorage
                    let value = localStorage.getItem(key);

                    // parse the localStorage string and setState
                    try {
                        value = JSON.parse(value);
                        this.setState({ [key]: value });
                    } catch (e) {
                        // handle empty string
                        this.setState({ [key]: value });
                    }
                }
            }
        }

        saveStateToLocalStorage() {
            // for every item in React state
            console.log("saving state");
            for (let key in this.state) {
                // save to localStorage
                localStorage.setItem(key, JSON.stringify(this.state[key]));
            }
        }

        // componentDidlMount(){
        //     console.log("From local storage" + JSON.stringify(JSON.parse(localStorage.getItem( name ))))
        //     this.setState( JSON.parse( localStorage.getItem( name )))
        // }

        // componentDidUpdate( nextProps, nextState ){
        //     console.log("Writing to local storage next props: " + JSON.stringify(nextProps));
        //     console.log("Name: " + name);
        //     localStorage.setItem( name, JSON.stringify( nextState ))
        // }

    }

    LocalStorageComponent.displayName = name

    return LocalStorageComponent

}


export default  WrapWithLocalStorage
