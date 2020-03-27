declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var scriptEcommerce = require('./Scripts/Script');
var resources = require('./../../Resources');
var uuidv1 = require('uuid/v1');

class Filters extends React.Component {
    state = {
        categories: null,
        branchs: null
    }

    componentDidMount() {
        scriptEcommerce.createNewVariableForEachUser();
        scriptEcommerce.intervalCarousel();
        scriptEcommerce.multiItemCarousel();
        scriptEcommerce.dropdownMenuLink();
        scriptEcommerce.slideCarousel();
        this.handleGetCategories();
        this.handleGetBranchs();
    }

    handleGetCategories() {

        fetch(resources.WebApiGoldenStart + "Family/GetFamilies",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })

            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            })
            .then(response => {
                this.setState({ ["categories"]: response });
            })
            .catch((err) => {
                console.log('Error', err.message);
            })
    }

    handleGetBranchs() {

        fetch(resources.WebApiGoldenStart + "Branch/GetBranchs",
            {
                mode: 'cors',
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json'
                })

            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('BAD HTTP stuff');
                }
            })
            .then(response => {
                this.setState({ ["branchs"]: response });
            })
            .catch((err) => {
                console.log('Error', err.message);
            })
    }

    render() {
        const { categories, branchs } = this.state;
        const { module, titleModule } = this.props;
        let title = <div />;

        switch (module) {
            case "Index":
                title = (<div key={uuidv1()} className="select-search">
                    <div key={uuidv1()} className="wrap-drop" id="noble-gases">
                        <span>Todas las categorías</span>
                        <ul key={uuidv1()} className="drop">
                            <li key={uuidv1()} className="selected"><a>Todas las categorías</a></li>
                            {categories != null &&
                                categories.map(category => {
                                    count = ++count;
                                    return (
                                        <li key={count} ><a>{category.Familia}</a></li>
                                    )
                                })}
                        </ul>
                    </div>
                    <div className="input-search">
                        <input type="text" placeholder="Buscar artículo" />
                        <i className="material-icons icon-search">search</i>
                    </div>
                </div>)
                break;
            case "Promotion":
                title = (<div key={uuidv1()} className="title-product--cart dp-flex">
                    <label key={uuidv1()} className="wth-60">{titleModule}</label> <a className="see-add" href="#"></a>
                    </div>
                    )
                break;
        }

        let count = 0;
        return (
            <div key={uuidv1()}className="header-ecommerce">
                {title}
                <div key={uuidv1()} className="dropdown">
                    <a key={uuidv1()} className="dropdown-toggle" data-toggle="dropdown">
                        Ordernar por
                        </a>
                    <div key={uuidv1()} className="dropdown-menu">
                        <a key={uuidv1()} className="dropdown-item" href="#">Menor precio</a>
                        <a key={uuidv1()} className="dropdown-item" href="#">Mayor precio</a>
                        <a key={uuidv1()} className="dropdown-item" href="#">Más antiguo</a>
                        <a key={uuidv1()} className="dropdown-item" href="#">Más nuevo</a>
                    </div>
                </div>
                <div key={uuidv1()} className="dropdown">
                    <a key={uuidv1()} className="dropdown-toggle" data-toggle="dropdown">
                        Filtrar por Sucursal
            </a>
                    <div key={uuidv1()} className="dropdown-menu">
                        {
                            branchs != null &&
                            branchs.map(branch => {
                                count = ++count
                                return (
                                    <a key={count} className="dropdown-item" href="#">{branch.Sucursal}</a>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(Filters);