declare var require: any
var React = require('react');
var Menu = require('../Menu/Menu').default
var Navbar = require('../Layout/Navbar').default
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Switch = require('react-router-dom').Switch;
var Route = require('react-router-dom').Route;
var IndexEcommerce = require('../Ecommerce/Index').default;
var ProductDetail = require('../Ecommerce/ProductDetail').default;
var CategoryDetail = require('../Ecommerce/CategoryDetail').default;
var SearchClient = require('../Clients/SearchClient').default;
var NewClient = require('../Clients/CreateUser').default;
var UploadFile = require('../UploadFile/UploadFile').default;
const Upclient = require('../Clients/UpClient').default;
var PurchaseSummary = require('../Ecommerce/PurchaseSummary').default;
const GeneralInfo =require('../Clients/generalInfo').default;

//<UploadFile />

export default class Dashboard extends React.Component {
    render() {
        return (
            <div className="main">
                <BrowserRouter>
                    <Navbar />
                    <div className="page">
                        <Menu />
                        <div className="container-fluid">
                            <Switch>
                                <Route exact path="/" component={IndexEcommerce} />
                                <Route exact path="/itemDetail" component={ProductDetail} />
                                <Route exact path="/searchClient" component={SearchClient} />
                                <Route exact path="/categoryDetail" component={CategoryDetail} />
                                <Route exact path="/purchaseSummary" component={PurchaseSummary} />
                                <Route exact path="/newClient">
                                    <Upclient/>
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
