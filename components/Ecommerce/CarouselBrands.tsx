declare var require: any

var React = require('react');
var resources = require('./../../Resources');



class Carousel extends React.Component {
    state = {
        brands: null
    }

    componentDidMount() {
        this.handleFolderImg();
    }

    handleFolderImg = async () => {
        let data = new FormData();
        data.append('descriptions', "CarouselMarcas");
        var descriptions = data.getAll('descriptions');

        let result = await fetch(resources.WebApiGoldenStart + "Folder/GetBrandImages",
            {
                mode: 'cors',
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                cache: 'no-cache',
                body: JSON.stringify(descriptions)
            });

        const res = await result.json();
        this.setState({ ["brands"]: res });
    }

    render() {
        const { brands } = this.state;
        let count = 0;
        return (
            <div className="slider-filter">
                <div className="">
                    <div id="sliderCarousel" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {
                                brands != null &&
                                brands.map(brand => {
                                    count = ++count;
                                    return (
                                        <div key={count} className={count == 1 ? "carousel-item active" : "carousel-item"} >
                                            <div className="row">
                                                {
                                                    brand.Images.map(m => {
                                                        count = ++count
                                                        return (<div className="col-md-3"><a href="#"><img key={count} src={m} alt="Image" /></a>   </div>)

                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                        <a className="carousel-control-prev" href="#sliderCarousel" data-slide="prev">
                            <i className="material-icons">arrow_back_ios</i>
                        </a>
                        <a className="carousel-control-next" href="#sliderCarousel" data-slide="next">
                            <i className="material-icons">arrow_forward_ios</i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Carousel;