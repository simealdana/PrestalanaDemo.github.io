declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var Filters = require('./Filters').default;
var AccordionCategory = require('./AccordionCategory').default;
var CategoryList = require('./CategoryList').default;

class CategoryDetailHeader extends React.Component {

    state = {
        familyId: 0
    }

    handleFamilySearch(familyId) {
        const { updateFamilyId } = this.props;
        updateFamilyId(familyId);
    }

    render() {

        const { itemtemObjet } = this.props.location.state;

        return (
            <div className="product-cart">
                <Filters module="Promotion" titleModule={itemtemObjet} />
                <div className="dp-flex">
                    <AccordionCategory
                        handleImageRandomTopFour={this.handleImageRandomTopFour}
                        handleFamilySearch={this.handleFamilySearch.bind(this)}
                    />
                    <CategoryList
                        title={itemtemObjet}

                    />
                </div>
            </div>
        )
    }
}


function mapStateTopProps(state) {
    return {
        cart: state.cart,
        relatedItems: state.ecommerce.relatedItems,
        updated: state.ecommerce.updated,
        search: state.ecommerce.search,
        itemsDetail: state.ecommerce.itemsDetail
    };
}


function mapDispatchToProps(dispatch) {
    return {
        updateItemsDetail: itemsDetail => {
            dispatch({ type: "UPDATE_ITEMS_DETAIL", payload: itemsDetail });
        },
        updateFamilyId: familyId => {
            dispatch({ type: "UPDATE_FAMILY_ID", payload: familyId });
        }
    };
}


export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(CategoryDetailHeader);