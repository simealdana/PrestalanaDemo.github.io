declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var Modal = require('../ShoppingCar/ConfirmationModal').default;
var ProductCard = require('./ProductCard').default;
var uuidv1 = require('uuid/v1');
var InfiniteScroll = require('react-infinite-scroller');
var resources = require('./../../Resources');
var Loader = require('react-loader');

class CategoryList extends React.Component {

    state = {
        products: null,
        showModal: false,
        objectPerPage: 9,
        random: null,
        items: null,
        hasMore: true,
        itemsQuantity: 0,
        done: false
    }

    handleImageRandomTopFour = async () => {
        const { objectPerPage, itemsQuantity, items } = this.state;
        const { search, familyId, pageNumbrer, updatePage } = this.props;

        var branchId = 62;

        if (items !== null && items.length >= itemsQuantity) {
            this.setState({ hasMore: false });
            return;
        }

        let result = await fetch(resources.WebApiGoldenStart + "Item/GetItemsPagination",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify({ Sucursal: branchId, NumberOfObjectsPerPage: objectPerPage, PageNumber: pageNumbrer, FamilyId: familyId, Search: search })
            });

        const res = await result.json();

        if (items === null) {
            this.setState({ "items": res.Items, "itemsQuantity": res.Count, "done": true })
            updatePage(pageNumbrer + 1);
        } else {
            this.setState({
                "items": this.state.items.concat(res.Items), "done": true
            });
            updatePage(pageNumbrer + 1);
        }
    }

    handlePageChange = () => {
        const { updatePage, pageNumbrer } = this.props;
        this.handleImageRandomTopFour();
        updatePage(pageNumbrer + 1);
    }

    render() {
        const { items, hasMore, done } = this.state;

        if (items === null) {
            this.handleImageRandomTopFour();
        }

        return (
           
                items === null ?
                <Loader loaded={done}> <div /> </Loader> :
                <div>
                    <Loader loaded={done}>
                    <InfiniteScroll
                        pageStart={1}
                        loadMore={this.handleImageRandomTopFour}
                        hasMore={hasMore}
                            threshold={100}
                            loader={<div className="loader" key={0}>Loading ...</div>}
                    >
                        {
                            this.state.items.map((i) => (
                                <ProductCard product={i} />
                            ))}

                        </InfiniteScroll>
                    </Loader>
                </div>
           
        )
    }
}


function mapStateTopProps(state) {
    return {
        cart: state.cart,
        relatedItems: state.ecommerce.relatedItems,
        updated: state.ecommerce.updated,
        pageNumbrer: state.ecommerce.pageNumbrer,
        familyId: state.ecommerce.familyId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePage: page => {
            dispatch({ type: "UPDATE_PAGE", payload: page });
        }
    };
}

export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(CategoryList);