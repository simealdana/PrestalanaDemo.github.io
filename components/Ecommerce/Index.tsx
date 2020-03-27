declare var require: any

var React = require('react');
var connect = require('react-redux').connect;
var Filters = require('./Filters').default
var Carousel = require('./Carousel').default
var CarouselBrands = require('./CarouselBrands').default
var Section = require('./Section').default
var resources = require('./../../Resources');

class Index extends React.Component {

    componentDidMount() {
        this.handleNonWorkingDays();
    }

    handleNonWorkingDays() {

        const { getNonWorkingDays, nonWorkingDays } = this.props;

        if (nonWorkingDays.length === 0) {
            fetch(resources.WebApiGoldenStart + "NonWorkingDays/GetNonWorkingDays",
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
                    getNonWorkingDays(response);
                })
                .catch((err) => {
                    console.log('Error', err.message);
                });
        }
    }

    render() {
        return (
            <div className="ecommerce">
                <Filters module="Index" />
                <Carousel />
                <CarouselBrands />
                <Section title="ARTÍCULOS NUEVOS" />
                <Section title="PROMOCIONES" />
                <Section title="ARTÍCULOS CON MAS DESCUENTO" />
            </div>
        );
    }
}

function mapStateTopProps(state) {
    return {
        nonWorkingDays: state.ecommerce.nonWorkingDays
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getNonWorkingDays: nonWorkingDays => {
            dispatch({ type: "GET_NON_WORKING_DAYS", payload: nonWorkingDays });
        }
    }
}

export default connect(mapStateTopProps, mapDispatchToProps)(Index);