declare var require: any

var React = require('react');
var connect = require('react-redux').connect;


class ClientHistory extends React.Component {
    render() {
        return (
            <div className="content-page history-customer" id="history">
                <div className="tabs-box">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="home-tab" data-toggle="tab" href="#apartados" role="tab" aria-controls="home" aria-selected="true">Apartados</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="profile-tab" data-toggle="tab" href="#empenos" role="tab" aria-controls="profile" aria-selected="false">Empeños</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active box-data" id="apartados" role="tabpanel" aria-labelledby="apartados-tab">

                            <div id="accordion">
                                <div>
                                    <div className="box-sku">
                                        <div className="label-value">
                                            <img src="~/image/phone.png" alt="Alternate Text" />
                                            <label>Celular Samsung A9</label>
                                        </div>
                                        <div className="dp-flex justify-content-end">
                                            <i className="material-icons icon-3points" data-toggle="collapse"  role="button" aria-expanded="false" aria-controls="collapse_One">more_horiz</i>
                                        </div>
                                    </div>
                                    <div id="collapse_One" className="collapse bg-white p-3" data-parent="#accordion">
                                        <div className="info-product">
                                            <div className="text-center">
                                                <img className="product" src="~/image/phone2.png" alt="Alternate Text" />
                                                <div>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                </div>
                                            </div>
                                            <div className="item-info--product">
                                                <label className="name-product">Celular Samsung A9</label>
                                                <div className="category-product"><span>Celulares</span></div>
                                                <div className="value-product"><span>$ 100.00</span></div>
                                                <div><span>Cantidad: 1</span></div>
                                                <div className="label-value">
                                                    <span>Regional</span>
                                                    <label>TLA - 3 Suburbano Tlanepantla</label>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="customer-btn flex-row">
                                            <div className="box-table">
                                                <div className="table-responsive">
                                                    <table className="table border-none">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center bold">No. Cuota</th>
                                                                <th className="text-center bold">Valor cuota</th>
                                                                <th className="text-center bold">Fecha estimada de pago</th>
                                                                <th className="text-center bold">Fecha pago</th>
                                                                <th className="text-center bold">Valor pagado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-center">0</td>
                                                                <td className="text-center">$10.00</td>
                                                                <td className="text-center">27/07/2019</td>
                                                                <td className="text-center">27/07/2019</td>
                                                                <td className="text-center">$10.00</td>
                                                            </tr>

                                                            <tr>
                                                                <td className="text-center">1</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">05/08/2019</td>
                                                                <td className="text-center">05/08/2019</td>
                                                                <td className="text-center">$18.00</td>
                                                            </tr>

                                                            <tr>
                                                                <td className="text-center">2</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">12/08/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">3</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">19/08/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">4</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">26/08/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">5</td>
                                                                <td className="text-center">$10.00</td>
                                                                <td className="text-center">03/09/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr className="total-table">
                                                                <td className="text-center">Total venta</td>
                                                                <td className="text-center">$100.00</td>
                                                                <td className="text-center"></td>
                                                                <td className="text-center"></td>
                                                                <td className="text-center">$28.00</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <a href="" className="btns btn-200px btn-go ">Registrar pago</a>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="box-sku">
                                        <div className="label-value">
                                            <img src="~/image/ps42.png" alt="Alternate Text" />
                                            <label>Play Station 4 Slim</label>
                                        </div>
                                        <div className="dp-flex justify-content-end">
                                            <i className="material-icons icon-3points" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapse_2">more_horiz</i>
                                        </div>
                                    </div>
                                    <div id="collapse_2" className="collapse bg-white p-3" data-parent="#accordion">
                                        <div className="info-product">
                                            <div className="text-center">
                                                <img className="product" src="~/image/ps42.png" alt="Alternate Text" />
                                                <div>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                    <i className="material-icons star star-active">star</i>
                                                </div>
                                            </div>
                                            <div className="item-info--product">
                                                <label className="name-product">Play Station 4 Slim</label>
                                                <div className="category-product"><span>Video Consolas</span></div>
                                                <div className="value-product"><span>$ 100.00</span></div>
                                                <div><span>Cantidad: 1</span></div>
                                                <div className="label-value">
                                                    <span>Regional</span>
                                                    <label>TLA - 3 Suburbano Tlanepantla</label>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="customer-btn flex-row">
                                            <div className="box-table">
                                                <div className="table-responsive">
                                                    <table className="table border-none">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center bold">No. Cuota</th>
                                                                <th className="text-center bold">Valor cuota</th>
                                                                <th className="text-center bold">Fecha estimada de pago</th>
                                                                <th className="text-center bold">Fecha pago</th>
                                                                <th className="text-center bold">Valor pagado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-center">0</td>
                                                                <td className="text-center">$10.00</td>
                                                                <td className="text-center">27/07/2019</td>
                                                                <td className="text-center">27/07/2019</td>
                                                                <td className="text-center">$10.00</td>
                                                            </tr>

                                                            <tr>
                                                                <td className="text-center">1</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">05/08/2019</td>
                                                                <td className="text-center">05/08/2019</td>
                                                                <td className="text-center">$18.00</td>
                                                            </tr>

                                                            <tr>
                                                                <td className="text-center">2</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">12/08/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">3</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">19/08/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">4</td>
                                                                <td className="text-center">$18.00</td>
                                                                <td className="text-center">26/08/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-center">5</td>
                                                                <td className="text-center">$10.00</td>
                                                                <td className="text-center">03/09/2019</td>
                                                                <td className="text-center">-</td>
                                                                <td className="text-center">-</td>
                                                            </tr>
                                                            <tr className="total-table">
                                                                <td className="text-center">Total venta</td>
                                                                <td className="text-center">$100.00</td>
                                                                <td className="text-center"></td>
                                                                <td className="text-center"></td>
                                                                <td className="text-center">$28.00</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <a href="" className="btns btn-200px btn-go ">Registrar pago</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="tab-pane fade box-data" id="empenos" role="tabpanel" aria-labelledby="empeños-tab">
                            <div id="accordion">
                                <div>
                                    <div className="box-sku">
                                        <div className="label-value">
                                            <span>No. Contrato:</span>
                                            <label>00001</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Avalúo:</span>
                                            <label>$ 542.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Prestamo:</span>
                                            <label className="cl-green">$ 500.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Pago refrendo:</span>
                                            <label>$ 74.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Pago desempeño:</span>
                                            <label>$ 528.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Plazo:</span>
                                            <label>Quincenal</label>
                                        </div>
                                        <div className="dp-flex justify-content-end">
                                            <i className="material-icons" data-toggle="modal" data-target="#modal-cart--print">print</i>
                                            <i className="material-icons icon-3points" data-toggle="collapse"  role="button" aria-expanded="false" aria-controls="collapse_One">more_horiz</i>
                                        </div>
                                    </div>
                                    <div id="collapse_One" className="collapse bg-white p-3" data-parent="#accordion">
                                        <div className="dp-flex justify-content-between pb-4">
                                            <div className="label-value label-column">
                                                <span>No. referndos:</span>
                                                <label>71</label>
                                            </div>
                                            <div className="label-value label-column">
                                                <span>Interés:</span>
                                                <label>$ 60.00</label>
                                            </div>
                                            <div className="label-value label-column">
                                                <span>Plazo en el que más refrenda:</span>
                                                <label>2 plazo</label>
                                            </div>
                                            <div className="label-value label-column">
                                                <span>¿Refrenda en semana oculta?</span>
                                                <label>Si</label>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center bold">No. Plazo</th>
                                                        <th className="text-center bold">Fecha límite de pago</th>
                                                        <th className="text-center bold">Interés</th>
                                                        <th className="text-center bold">IVA</th>
                                                        <th className="text-center bold">Total para desempeño</th>
                                                        <th className="text-center bold">Total por refrendo</th>
                                                        <th className="text-center bold">% creciente de interés</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-center">1</td>
                                                        <td className="text-center">27/07/2019</td>
                                                        <td className="text-center">$ 20.00</td>
                                                        <td className="text-center">$ 8.00</td>
                                                        <td className="text-center">$ 528.00</td>
                                                        <td className="text-center">$ 28.00</td>
                                                        <td className="text-center">10%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center">2</td>
                                                        <td className="text-center">27/07/2019</td>
                                                        <td className="text-center">$ 40.00</td>
                                                        <td className="text-center">$ 8.00</td>
                                                        <td className="text-center">$ 548.00</td>
                                                        <td className="text-center">$ 48.00</td>
                                                        <td className="text-center">10%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center">3</td>
                                                        <td className="text-center">27/07/2019</td>
                                                        <td className="text-center">$ 60.00</td>
                                                        <td className="text-center">$ 8.00</td>
                                                        <td className="text-center">$ 568.00</td>
                                                        <td className="text-center">$ 68.00</td>
                                                        <td className="text-center">10%</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="dp-flex">
                                            <div className="radio-button">
                                                <label className="label-radio">¿Quién realiza la operación?</label>
                                                <div className="item-radio--button">
                                                    <div className="pr-4">
                                                        <input type="radio" id="test3" name="radio-group" checked />
                                                        <label htmlFor="test3">Titular</label>
                                                    </div>
                                                    <div className="pr-4">
                                                        <input type="radio" id="test4" name="radio-group" />
                                                        <label htmlFor="test4">Cotitular</label>
                                                    </div>
                                                    <div className="pr-4">
                                                        <input type="radio" id="test5" name="radio-group" />
                                                        <label htmlFor="test5">Beneficiario</label>
                                                    </div>
                                                    <div className="pr-4">
                                                        <input type="radio" id="test6" name="radio-group" />
                                                        <label htmlFor="test6">Otro</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="buttons">
                                                    <a className="btns btn-go" data-toggle="modal" data-target="#modal-refrendar"><i className="material-icons" >shopping_cart</i> refrendar</a>
                                                    <a href="#" className="btns btn-go"><i className="material-icons">shopping_cart</i>desempeñar</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="box-sku">
                                        <div className="label-value">
                                            <span>No. Contrato:</span>
                                            <label>00002</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Avalúo:</span>
                                            <label>$ 542.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Prestamo:</span>
                                            <label className="cl-green">$ 500.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Pago refrendo:</span>
                                            <label>$ 74.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Pago desempeño:</span>
                                            <label>$ 528.00</label>
                                        </div>
                                        <div className="label-value label-column">
                                            <span>Plazo:</span>
                                            <label>Quincenal</label>
                                        </div>
                                        <div className="dp-flex justify-content-end">
                                            <i className="material-icons" data-toggle="modal" data-target="#modal-cart--print">print</i>
                                            <i className="material-icons icon-3points" data-toggle="collapse"  role="button" aria-expanded="false" aria-controls="collapse_2">more_horiz</i>
                                        </div>
                                    </div>
                                    <div id="collapse_2" className="collapse bg-white p-3" data-parent="#accordion">
                                        <div className="dp-flex justify-content-between pb-4">
                                            <div className="label-value label-column">
                                                <span>No. referndos:</span>
                                                <label>71</label>
                                            </div>
                                            <div className="label-value label-column">
                                                <span>Interés:</span>
                                                <label>$ 60.00</label>
                                            </div>
                                            <div className="label-value label-column">
                                                <span>Plazo en el que más refrenda:</span>
                                                <label>2 plazo</label>
                                            </div>
                                            <div className="label-value label-column">
                                                <span>¿Refrenda en semana oculta?</span>
                                                <label>Si</label>
                                            </div>

                                        </div>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center bold">No. Plazo</th>
                                                        <th className="text-center bold">Fecha límite de pago</th>
                                                        <th className="text-center bold">Interés</th>
                                                        <th className="text-center bold">IVA</th>
                                                        <th className="text-center bold">Total para desempeño</th>
                                                        <th className="text-center bold">Total por refrendo</th>
                                                        <th className="text-center bold">% creciente de interés</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="text-center">1</td>
                                                        <td className="text-center">27/07/2019</td>
                                                        <td className="text-center">$ 20.00</td>
                                                        <td className="text-center">$ 8.00</td>
                                                        <td className="text-center">$ 528.00</td>
                                                        <td className="text-center">$ 28.00</td>
                                                        <td className="text-center">10%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center">2</td>
                                                        <td className="text-center">27/07/2019</td>
                                                        <td className="text-center">$ 40.00</td>
                                                        <td className="text-center">$ 8.00</td>
                                                        <td className="text-center">$ 548.00</td>
                                                        <td className="text-center">$ 48.00</td>
                                                        <td className="text-center">10%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center">3</td>
                                                        <td className="text-center">27/07/2019</td>
                                                        <td className="text-center">$ 60.00</td>
                                                        <td className="text-center">$ 8.00</td>
                                                        <td className="text-center">$ 568.00</td>
                                                        <td className="text-center">$ 68.00</td>
                                                        <td className="text-center">10%</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="dp-flex">
                                            <div className="radio-button">
                                                <label className="label-radio">¿Quién realiza la operación?</label>
                                                <div className="item-radio--button">
                                                    <div className="pr-4">
                                                        <input type="radio" id="test7" name="radio-group" checked />
                                                        <label htmlFor="test7">Titular</label>
                                                    </div>
                                                    <div className="pr-4">
                                                        <input type="radio" id="test8" name="radio-group" />
                                                        <label htmlFor="test8">Cotitular</label>
                                                    </div>
                                                    <div className="pr-4">
                                                        <input type="radio" id="test9" name="radio-group" />
                                                        <label htmlFor="test9">Beneficiario</label>
                                                    </div>
                                                    <div className="pr-4">
                                                        <input type="radio" id="test10" name="radio-group" />
                                                        <label htmlFor="test10">Otro</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="buttons">
                                                    <a className="btns btn-go" data-toggle="modal" data-target="#modal-refrendar"><i className="material-icons" >shopping_cart</i> refrendar</a>
                                                    <a href="#" className="btns btn-go"><i className="material-icons">shopping_cart</i>desempeñar</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateTopProps(state) {
    return {
        cart: state.cart,
        amountPurchase: state.ecommerce.amountPurchase,
        list: state.ecommerce.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePurchaseAmount: amount => {
            dispatch({ type: "UPDATE_PURCHASE_AMOUNT", payload: amount })
        }
    }
}

export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(ClientHistory);