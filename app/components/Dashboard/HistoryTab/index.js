import React from 'react';
import {Tab} from 'semantic-ui-react';
import Img from 'react-image-smooth-loading';

import styles from './styles.scss';

class HistoryTab extends React.Component {
    constructor(props) {
        super(props);
      } 
    render() {
        console.log(this.props);
        let songHistory = this.props.stuff.songHistory;
        const songList = songHistory.map((song, i) => <div key={song.name + i} className={styles.history_item}>{song.name}</div>);
        return (
            <Tab.Pane attached={false}>
                <div className={styles.history_container}>
                    {songList}
                </div>   
            </Tab.Pane>
        );
    }
}

export default HistoryTab;