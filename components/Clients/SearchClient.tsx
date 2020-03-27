declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var resources = require('./../../Resources');
var Redirect = require('react-router-dom').Redirect;
var uuidv1 = require('uuid/v1');
var UserSection = require('./UserSection').default;
var Loader = require('react-loader');

class SearchClient extends React.Component {

    state = {
        products: null,
        random: null,
        promo: null,
        moreDiscount: null,
        redirect: false,
        showModal: false,
        selectedItem: null,
        clients: null,
        done: false
    }

    handleFiendClient = async () => {
        const { updateClientFiltered, clientName } = this.props;

        let result = await fetch(resources.WebApiGoldenStart + "Client/FindClients",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(clientName)
            });

        const res = await result.json();

        this.setState({ "clients": res, "done": true }, function () {
            updateClientFiltered(res);
        });
    }

    handleSearch = (e) => {
        const { updateClientFiltered } = this.props;
        const { clients } = this.state;

        var updatedList = clients;

        updatedList = updatedList.filter(function (item) {
            return (item.Nombres + ' ' + item.ApellidoPaterno + ' ' + item.ApellidoMaterno).toLowerCase().search(
                e.target.value.toLowerCase()) !== -1;
        });

        updateClientFiltered(updatedList);
    }

    render() {

        const { done } = this.state;
        const { filterClients } = this.props;


        if (filterClients === null) {
            this.handleFiendClient();
        }

        return (
            <div className="content-page cliente-info-general" >
                <Loader loaded={done}>
                    <div className="text-button--right">
                        <div className="search wth-40">
                            <div className="group">
                                <input type="text" onChange={this.handleSearch} required />
                                <span className="bar"></span>
                                <label>Buscar</label>
                                <i className="material-icons icon-search">search</i>
                            </div>
                        </div >
                        <div className="buttons">
                            <a href="" className="btns btn-go ">Crear cliente</a>
                        </div>
                    </div >
                    {
                        <UserSection clients={filterClients} isSearchClient={true} />
                    }
                </Loader>
            </div>
        );
    }
}

function mapStateTopProps(state) {
    return {
        filterClients: state.client.filterClients,
        clientName: state.ecommerce.clientName
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateClientFiltered: clients => {
            dispatch({ type: "CLIENTS_FILTERED", payload: clients })
        }
    }
}

export default connect(
    mapStateTopProps, mapDispatchToProps
)(SearchClient);