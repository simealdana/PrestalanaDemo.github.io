declare var require: any

var React = require('react');
var Redirect = require('react-router-dom').Redirect;
var connect = require('react-redux').connect;

const logoMultiapoyo = "images/logo-multiapoyo.svg";

class EcommerceLinks extends React.Component {

    state = {
        redirect: false
    }

    renderRedirect = () => {
        const { updateUpdateIsEditClient } = this.props;
        updateUpdateIsEditClient(true);
        if (this.state.redirect) {
            return (
                <Redirect
                    to={{
                        pathname: "/newClient"
                    }}
                />
            );
        }
    }

    setRedirect = () => {
        const { updatePathnameRedirect } = this.props;
        updatePathnameRedirect("/")
        this.setState({
            redirect: true
        });
    };

    render() {
        return (
            <div className="tab-page--menu col-10">
                <a className="menu-header"><i className="material-icons icon-menu">menu</i></a>
                <img className="img-logo" src={logoMultiapoyo} />
                <div id="ecommerce" className="item-page--menu item-active">
                    Ecommerce
                </div>
                <a onClick={() => this.setRedirect()} className="ecommerce-new-customer">Cliente nuevo</a>
                {this.renderRedirect()}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateUpdateIsEditClient: isEdit => {
            dispatch({ type: "UPDATE_IS_EDIT", payload: isEdit })
        },
        updatePathnameRedirect: pathnameRedirect => {
            dispatch({ type: "UPDATE_GLOBAL_REDIRECT", payload: pathnameRedirect })
        }
    }
}



export default connect(
    null,
    mapDispatchToProps
)(EcommerceLinks);