declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var scriptModal = require('./Scripts/Script');
var uuidv1 = require('uuid/v1');



class ConfirmationModal extends React.Component {
    state = {
    }

    componentDidMount() {
        scriptModal.openModal();
    }

    componentDidUpdate() {
        scriptModal.openModal();
    }

    render() {
        const { cart} = this.props;
        const item = cart[cart.length - 1];

        let totalValue = 0;

        cart.map(item => {
            totalValue = item.Avaluo + totalValue
        })


        return (
            <div key={uuidv1()} className="modal" id="modal-buy--product" data-keyboard="false" data-backdrop="static">
                <div key={uuidv1()}  className="modal-dialog modal-xl">
                    <div key={uuidv1()}  className="modal-content">
                        <div key={uuidv1()}  className="modal-header">
                            <div key={uuidv1()}  className="message message-success">
                                <i key={uuidv1()}  className="material-icons">done</i>
                                <span key={uuidv1()} >Producto agregado con éxito a su carrito de compras</span>
                            </div>
                        </div>

                        <div key={uuidv1()}  className="modal-body box-cart">
                            <div key={uuidv1()}  className="item-cart flex-row">
                                <div key={uuidv1()} className="img-product--modal">
                                    <img key={uuidv1()}  src={`data:image/jpeg;base64,${item.Document.Documento}`} alt="Alternate Text" />
                                </div>
                                <div>
                                    <label key={uuidv1()}  className="item-title--cart">{item.Descripcion}</label>
                                    <div key={uuidv1()}  className="label-value label-column value-cart">
                                        <span key={uuidv1()} >Valor del producto:</span>
                                        <label key={uuidv1()}  className="cl-green">$ {item.Avaluo}</label>
                                    </div>
                                    <div key={uuidv1()}  className="label-value">
                                        <span key={uuidv1()} >Sucursal:</span>
                                        <label key={uuidv1()} >{item.Sucursal}</label>
                                    </div>

                                </div>
                            </div>
                            <div key={uuidv1()}  className="line"></div>
                            <div key={uuidv1()}  className="item-cart">
                                <label key={uuidv1()}  className="mb-3">Hay {cart.length} artículos en el carrito de compras</label>
                                <div key={uuidv1()}  className="label-value mb-3">
                                    <span key={uuidv1()} >Valor compra total:</span>
                                    <label key={uuidv1()} >${totalValue}</label>
                                </div>
                                <div key={uuidv1()}  className="label-value mb-3">
                                    <span key={uuidv1()} >Valor mímino apartado:</span>
                                    <label key={uuidv1()} >$ 20.00</label>
                                </div>
                            </div>
                        </div>
                        <div key={uuidv1()}  className="modal-footer">
                            <a key={uuidv1()}  href="" className="btns btn-se" data-dismiss="modal">Seguir comprando</a>
                            <a key={uuidv1()}  href="" className="btns btn-go" data-dismiss="modal" data-toggle="modal" data-target="#modal-pay">Proceder pago</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateTopProps(state) {
    return {
        cart: state.cart
    };
}

export default connect(
    mapStateTopProps,
    null
)(ConfirmationModal);
