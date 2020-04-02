declare var require: any

var React = require('react');
var Redirect = require('react-router-dom').Redirect;
var scriptMenu = require('./Scripts/Script');
var resources = require('../../Resources');
var uuidv1 = require('uuid/v1');
var connect = require('react-redux').connect;

const logoMascara = "images/logo_mascara.svg";
const logoMultiapoyo = "images/logo-multiapoyo.svg";
const banderaUnitaria = "images/banderaUnitaria.png";


class Menu extends React.Component {

    state = {
        menu: null,
        token: null,
        redirect: false
    }

    componentDidMount() {
        scriptMenu.slideSubMenu();
        scriptMenu.containerMenu();
        scriptMenu.resizeMenu();
        this.handleUser();
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

    //Pasar esto al login cuando sea implementado
    handleUser = async () => {
        const { token } = this.state;

        if (token === null) {
            let data = {
                UserName: "HALEJANDRO",
                Password: "ALEJANDR0123"
            }

            fetch(resources.WebApiGoldenStart + "Login/Index",
                {
                    mode: 'cors',
                    method: "POST",
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }),
                    cache: 'no-cache',
                    body: JSON.stringify(data)

                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log(response)
                    }
                }).then(json => {
                    if (json.usuario !== null) {
                        var token = json.usuario.Token;
                        this.setState({ ["token"]: token }, () => { this.handleMenuByUser(); });
                    }
                    else {
                        console.log("Error usuario")
                    }
                });
        }
    }

    handleMenuByUser = async () => {
        const { token, menu } = this.state;
        if (token !== null && menu == null) {
            fetch(resources.WebApiGoldenStart + "Login/GetMenu",
                {
                    mode: 'cors',
                    method: "GET",
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization': 'Bearer ' + token

                    }),
                    cache: 'no-cache'
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log(response)
                    }
                }).then(json => {
                    if (json.length > 0) { return json; }
                }).then(menu => {
                    this.setState({ ["menu"]: menu });
                });
        }
    }
    //Pasar esto al login cuando sea implementado

    handleNewClient = e => {
        this.props.selectMenu(e.currentTarget.id);
    }

    handleRol = e => {
        this.props.selectMenu(e.currentTarget.id);
    }

    handleMenu = e => {
        this.props.selectMenu(e.currentTarget.id);
    }

    render() {
        const { menu } = this.state;

        let count = 0;
        return (
            <div key={uuidv1()} className="container-menu">

                {/*Maqueta Yeison*/}
                <ul>
                    <li className="item-menu shortcut">
                        <a href="#">
                            <div className="dp-flex">
                                <i className="icon-add material-icons">add</i>
                                <span>Item Top</span>
                            </div>
                        </a>
                    </li>
                    <li className="item-menu">
                        <a href="#">
                            <div className="dp-flex">
                                <i className="material-icons">local_offer</i>
                                <span>Ventas</span>
                            </div>
                            <i className="material-icons icon-keyboard-arrow-down">keyboard_arrow_down</i>
                        </a>
                        <ul>
                            <li><a id="#">Item 1</a></li>
                            <li><a id="#">Item 2</a></li>
                        </ul>
                    </li>
                    <li className="item-menu">
                        <a href="#">
                            <div className="dp-flex">
                                <i className="material-icons">group</i>
                                <span>Clientes</span>
                            </div>
                            <i className="material-icons icon-keyboard-arrow-down">keyboard_arrow_down</i>
                        </a>
                        <ul>
                            <li><a onClick={() => this.setRedirect()}>Cliente Nuevo</a></li>
                        </ul>
                    </li>
                </ul>

                {/*<div key={uuidv1()} className="logo">
                   <img key={uuidv1()} className="logo-mascara" src={logoMascara} />
                   <img key={uuidv1()} className="img-logo" src={logoMultiapoyo} />
                </div>
                <div key={uuidv1()} className="btn-menu">
                    <a>
                        <i key={uuidv1()} className="material-icons icon-menu">menu</i>
                        <i key={uuidv1()} className="material-icons icon-close-menu">vertical_split</i>
                        <i key={uuidv1()} className="material-icons icon-search">search</i>
                    </a>
                </div>*/}
                <ul key={count + 20} className="menu">
                    {
                        menu !== null &&
                        menu.map(m => {
                            count = ++count;
                            return (
                                <li key={uuidv1()} className="item-menu">
                                    <a key={uuidv1()} href="#">
                                        <i key={uuidv1()} className="material-icons">supervisor_account</i>
                                        <span>{m.Menu}</span>
                                        <i key={uuidv1()} className="material-icons arrow-down">keyboard_arrow_down</i>
                                    </a>
                                    <ul key={uuidv1()}>
                                        {
                                            m.Hijos !== null &&
                                            m.Hijos.map(h => {
                                                return (
                                                    <li key={uuidv1()}>
                                                        <a key={uuidv1()} id={h.IdMenu} href={h.Accion}>{h.Menu}</a>
                                                    </li>);
                                            })
                                        }
                                    </ul>
                                </li>
                            );
                        })
                    }
                </ul>



                <div key={uuidv1()} className="lenguage">
                    <img src={banderaUnitaria} alt="Alternate Text" />
                    <span>MXN</span>
                </div>
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
)(Menu);
