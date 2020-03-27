declare var require: any

var React = require('react');
var Redirect = require('react-router-dom').Redirect;
var connect = require('react-redux').connect;
var scriptModal = require('./Scripts/Script');
var cloneDeep = require('lodash.clonedeep');
var uuidv1 = require('uuid/v1');

class SearchClient extends React.Component {
    state = {
        redirect: false,
        clientName: null
    }

    renderRedirect = () => {

        var client = document.getElementById('client') as HTMLInputElement;
        scriptModal.closeModal();

        if (client !== null && client.value === "") {
            if (this.state.redirect) {
                return (
                    <Redirect
                        to={{
                            pathname: "/newClient"
                        }}
                    />
                );
            }
        } else {
            if (this.state.redirect) {
                const { updateClientFiltered, updateClientNameToSearch } = this.props;
                var clientClone = cloneDeep(client.value);
                client.value = '';
                updateClientFiltered(null);
                updateClientNameToSearch(clientClone);
                return (
                    <Redirect
                        to={{
                            pathname: "/searchClient"
                        }}
                    />
                );
            }
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        });
    };

    render() {
        return (
            <div key={uuidv1()} className="modal" id="modal-search--client">
                <div key={uuidv1()} className="modal-dialog modal-md">
                    <div key={uuidv1()} className="modal-content">
                        <div key={uuidv1()} className="modal-header">
                            <div key={uuidv1()}>
                                <label key={uuidv1()} className="title text-center">
                                    Para continuar la venta, busca o crea un nuevo cliente
                    </label>
                            </div>
                            <button key={uuidv1()} type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div key={uuidv1()} className="modal-body">
                            <div key={uuidv1()} className="mui-textfield mui-textfield--float-label">
                                <input key={uuidv1()} type="text" id="client" required />
                                <label key={uuidv1()}>Nombre del cliente</label>
                                <i key={uuidv1()} className="material-icons icon-search">search</i>
                            </div>
                        </div>

                        <div key={uuidv1()} className="modal-footer flex-column">
                            <a key={uuidv1()} onClick={() => this.setRedirect()} className="btns btn-go">Buscar cliente</a>
                            <a key={uuidv1()} onClick={() => this.setRedirect()} className="ecommerce-new-customer">Cliente nuevo</a>
                        </div>
                    </div>
                </div>
                {this.renderRedirect()}
            </div>
        )
    }
}



function mapDispatchToProps(dispatch) {
    return {
        updateClientFiltered: clients => {
            dispatch({ type: "CLIENTS_FILTERED", payload: clients })
        },
        updateClientNameToSearch: clientaName => {
            dispatch({ type: "UPDATE_CLIENT_NAME_TO_SEARCH", payload: clientaName })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SearchClient);
