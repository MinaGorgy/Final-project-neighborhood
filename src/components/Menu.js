import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Menu extends Component {

    state = { visible: false }

    handleClick = () => { this.setState(prev => ({ visible: !prev.visible })) }

    render() {

        const { query, cafes, connectLiToMarker, updateQuery } = this.props;
        const { visible } = this.state;

        const style = {
            'zIndex': '1',
            'position': 'absolute',
        }

        return (
            <div className={visible ? 'slideIn menu' : 'slideOut menu'}
                tabIndex={visible ? '0' : '-1'}
                style={style}>

                <button className="menu-btn" onClick={this.handleClick}><FontAwesomeIcon icon="bars" /></button>
               

                <input
                    className="search-input"
                    tabIndex={visible ? '0' : '-1'}
                    type="text"
                    placeholder="Search by cafe name "
                    value={query}
                    onChange={(e) => updateQuery(e.target.value)}
                    aria-label={`search for cafe by name`}
                />


                <ol>
                    {!this.props.fetchError ?


                        cafes.map(cafe =>

                            <li
                                key={cafe.name}
                                aria-label={`show the ${cafe.name} info window`}
                                role="button"
                                tabIndex={visible ? '0' : '-1'}
                                onClick={(e) => connectLiToMarker(cafe)}
                                onKeyPress={(e) => connectLiToMarker(cafe)}
                            >{cafe.name}
                            </li>

                        ) : <li> Faild to fetch data from Four Square API</li>


                    }
                </ol>

            </div>
        )
    }

}

export default Menu;