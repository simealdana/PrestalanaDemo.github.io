declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var resources = require('./../../Resources');
var uuidv1 = require('uuid/v1');

class AccordionCategory extends React.Component {

    state = {
        search: null
    }

    handleCategories = async () => {
        var branchId = 62;
        const { setCategories } = this.props;

        let result = await fetch(resources.WebApiGoldenStart + "Groups/GetGroupsWithFamilies",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(branchId)
            });

        const res = await result.json();

        setCategories(res);
    }

    handleChange = (e) => {
        const { updateSearch } = this.props;
        updateSearch(e.target.value);
    }

   

    render() {
        let count:any = 0;
        const { categories, handleFamilySearch, handleImageRandomTopFour, updatePage } = this.props
        const { search } = this.state;
        updatePage(1)

        if (categories.length == 0) {
            this.handleCategories();
        } 



        return (
            <div className="wth-30 pr-5" >
                <div className="group p-0">
                    <input type="text" onChange={this.handleChange} required />
                    <span className="bar"></span>
                    <label>Buscar</label>
                    <i onClick={handleImageRandomTopFour} className="material-icons icon-search">search</i>
                </div>
                <div className="box-list--category">
                    <label className="title-shopping--cart">Categorias</label>
                    <div id="accordion" className="myaccordion">
                        {categories != null &&
                            categories.map(category => {
                                count = ++count;
                                return (
                                    <div key={uuidv1()} className="card" id={count}>
                                        <div key={uuidv1()} className="card-header" id="headingOne">
                                            <h2 className="mb-0">
                                                <button className={count === 1 ? "d-flex align-items-center justify-content-between btn btn-link" : "d-flex align-items-center justify-content-between btn btn-link collapsed"} data-toggle="collapse" data-target={"#collapse" + count} aria-expanded="true" aria-controls={count}>
                                                    <span>{category.Grupo}</span>
                                                    <i className="material-icons arrow-down">keyboard_arrow_down</i>
                                                </button>
                                            </h2>
                                        </div>
                                        <div key={uuidv1()} id={"collapse" + count} className={count === 1 ? "collapse show" : "collapse"} aria-labelledby="headingOne" data-parent="#accordion">
                                            <div className="card-body">
                                                <ul>
                                                    {category.Familias != null &&
                                                        category.Familias.map(family => {
                                                            return (
                                                                <li key={uuidv1()}><a key={uuidv1()} onClick={() => handleFamilySearch(family.IdFamilia)} >{family.Familia}<span>{family.CountArticulos}</span></a></li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );

                            })
                        }
                    </div>
                </div>

            </div>
        )
    }
}


function mapStateTopProps(state) {
    return {
        cart: state.cart,
        categories: state.ecommerce.categories,
        updated: state.ecommerce.updated
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addToCart: item => {
            dispatch({ type: "ADD", payload: item });
        },
        setCategories: item => {
            dispatch({ type: "SET_CATEGORIES", payload: item });
        },
        updateSearch: search => {
            dispatch({ type: "UPDATE_SEARCH", payload: search });
        },
        updateFamily: familyId => {
            dispatch({ type: "UPDATE_FAMILY_ID", payload: familyId });
        },
        updatePage: page => {
            dispatch({ type: "UPDATE_PAGE", payload: page });
        }
    };
}

export default connect(
    mapStateTopProps,
    mapDispatchToProps
)(AccordionCategory);