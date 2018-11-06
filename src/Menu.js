import React, { Component } from 'react';


class Menu extends Component {

    state = { visible: false }

    handleClick = () => { this.setState(prev => ({ visible: !prev.visible })) }

    render() {

        const { query, places, connectLiToMarker, updateQuery } = this.props;
        const { visible } = this.state;

        const style = {
            'zIndex': '1',
            'position': 'absolute'
        }

        return (
            <div className={visible ? 'slideIn menu' : 'slideOut menu'}
                tabIndex={visible ? '0' : '-1'}
                style={style}>

                <button className="menu-btn" onClick={this.handleClick}>Menu &#x268C;</button>

                <input
                    className="search-input"
                    tabIndex={visible ? '0' : '-1'}
                    type="text"
                    placeholder="Search by title"
                    value={query}
                    onChange={(e) => updateQuery(e.target.value)}
                    aria-label={`search for museum by name`}
                />


                <ol>
                    {!this.props.fetchError ?


                        places.map(place =>

                            <li
                                key={place.name}
                                aria-label={`show the ${place.name} info window`}
                                role="button"
                                tabIndex={visible ? '0' : '-1'}
                                onClick={(e) => connectLiToMarker(place)}
                                onKeyPress={(e) => connectLiToMarker(place)}
                            >{place.name}
                            </li>

                        ) : <li> Faild to fetch data from Four Square API</li>


                    }
                </ol>

            </div>
        )
    }

}

export default Menu;