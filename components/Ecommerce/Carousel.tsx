declare var require: any

var React = require('react');
var uuidv1 = require('uuid/v1');

function convertUnicode(input) {
    return input.replace(/\\u(\w{4,4})/g, function (a, b) {
        var charcode = parseInt(b, 16);
        return String.fromCharCode(charcode);
    });
}

class Carousel extends React.Component {
    state = {
        banner: null
    }

    componentDidMount() {
        this.handleBanner();
    }

    handleBanner = () => {
        var obj = new Object();
        obj["featuredArticles"] = [{
            family: "Electrónicos",
            item: "Celular Iphone 8",
            shortDescription: "Libre 32 GB, Color Rosado, Camara 12mpx",
            idItem: 1,
            imageUrl:
                "https://storage.cloud.google.com/prestalana-82462.appspot.com/banner/ecommerce1.png"
        },
        {
            family: "Electrónicos",
            item: "Parlante Inalambrico",
            shortDescription: "Parlante inalambrico 15 dsb, color negro bocinas  auxiliares",
            idItem: 2,
            imageUrl:
                "https://storage.cloud.google.com/prestalana-82462.appspot.com/banner/ecommerce2.png"
        }]

        this.setState({ ["banner"]: obj });
    }

    render() {
        const { banner } = this.state;
        let count = 0;
        return (
            <div key={uuidv1()} id="demo" className="carousel big slide" data-ride="carousel">
                <ul key={uuidv1()} className="carousel-indicators">
                    <li key={uuidv1()}  data-target="#demo" data-slide-to="0" className="active"></li>
                    <li key={uuidv1()}  data-target="#demo" data-slide-to="1"></li>
                    <li key={uuidv1()}  data-target="#demo" data-slide-to="2"></li>
                </ul>

                {banner &&
                    banner.featuredArticles.map(item => {
                        count = ++count
                        return (
                            <div key={uuidv1()}  className="carousel-inner">
                                <div key={uuidv1()}  className={count === 1 ? "carousel-item active" : "carousel-item"} >

                                    <img key={uuidv1()} src={item.imageUrl} />
                                    <div key={uuidv1()}  className="carousel-item--text">
                                        <span key={uuidv1()} className="carousel-item--category">{convertUnicode(item.family)}</span>
                                        <h2 key={uuidv1()}>{item.item}</h2>
                                        <span key={uuidv1()} className="carousel-item--description">{item.shortDescription}</span>
                                        <a key={uuidv1()} href="" data-toggle="modal" data-target="#modal-buy--product" className="btns btn-go add">Agregar <i className="material-icons">shopping_cart</i>
                                        </a>
                                    </div>
                                </div>
                            </div>)

                    })
                }

            </div>
        );
    }
}

export default Carousel;