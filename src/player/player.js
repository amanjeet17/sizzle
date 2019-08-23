import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import Video from './demo';
import Duration from './duration'
class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            videos: ['https://www.youtube.com/watch?v=oUFJJNQGwhk', 'https://www.youtube.com/watch?v=XhF26ZWBJKU'],
            pip: false,
            playing: false,
            controls: true,
            light: false,
            volume: 1,
            muted: true,
            played: 0,
            loaded: 0,
            duration: 0,
            playbackRate: 1.0,
            loop: false,
            playerRefs:[]
        }
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleStop = () => {
        this.setState({ url: null, playing: false })
    }

    handleToggleControls = () => {
        const url = this.state.url
        this.setState({
            controls: !this.state.controls,
            url: null
        }, () => this.load(url))
    }

    handleToggleLight = () => {
        this.setState({ light: !this.state.light })
    }

    handleToggleLoop = () => {
        this.setState({ loop: !this.state.loop })
    }

    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    handleToggleMuted = () => {
        this.setState({ muted: !this.state.muted })
    }

    handleSetPlaybackRate = e => {
        this.setState({ playbackRate: parseFloat(e.target.value) })
    }

    handleTogglePIP = () => {
        this.setState({ pip: !this.state.pip })
    }

    handlePlay = () => {
        console.log('onPlay')
        this.setState({ playing: true })
    }

    handleEnablePIP = () => {
        console.log('onEnablePIP')
        this.setState({ pip: true })
    }

    handleDisablePIP = () => {
        console.log('onDisablePIP')
        this.setState({ pip: false })
    }

    handlePause = () => {
        console.log('onPause')
        this.setState({ playing: false })
    }

    handleSeekMouseDown = e => {
        console.log("handleSeekMouseDown", e);
        this.setState({ seeking: true })
    }

    handleSeekChange = e => {
        console.log("handleSeekChange", e.target.value);
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleSeekMouseUp = e => {
        console.log("handleSeekMouseUp", e.target.value);
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }

    handleEnded = () => {
        console.log('onEnded')
        this.setState({ playing: this.state.loop })
    }

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
    }

    handleClickFullscreen = () => {
        screenfull.request(findDOMNode(this.player))
    }

    ref = player => {
        console.log("refs", player)
        this.player = player
    }

    abc = time => {
        console.log('onReady')
        // this.player.seekTo(113.2);
    }

    passRef = (player) => {
        console.log("this.state.playerRefs",this.state.playerRefs)
        var playerRefs = this.state.playerRefs.slice();
        playerRefs.push(player);
        console.log("playerRefs",playerRefs);
        this.setState({playerRefs : playerRefs});
    }

    render() {
        const { videos } = this.state;
        const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip } = this.state
        const SEPARATOR = ' · '
        console.log("render", this.state)
        return (
            <div>
                {
                    videos.map((video) => <Video link={video} passRef={this.passRef} />)
                }
                <table>
                    <tbody>
                        <tr>
                            <th>Controls</th>
                            <td>
                                <button onClick={this.handleStop}>Stop</button>
                                <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                                <button onClick={this.handleClickFullscreen}>Fullscreen</button>
                            </td>
                        </tr>
                        <tr>
                            <th>Speed</th>
                            <td>
                                <button onClick={this.handleSetPlaybackRate} value={1}>1x</button>
                                <button onClick={this.handleSetPlaybackRate} value={1.5}>1.5x</button>
                                <button onClick={this.handleSetPlaybackRate} value={2}>2x</button>
                            </td>
                        </tr>
                        <tr>
                            <th>Seek</th>
                            <td>
                                <input
                                    type='range' min={0} max={1} step='any'
                                    value={played}
                                    onMouseDown={this.handleSeekMouseDown}
                                    onChange={this.handleSeekChange}
                                    onMouseUp={this.handleSeekMouseUp}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Volume</th>
                            <td>
                                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.handleVolumeChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor='controls'>Controls</label>
                            </th>
                            <td>
                                <input id='controls' type='checkbox' checked={controls} onChange={this.handleToggleControls} />
                                <em>&nbsp; Requires player reload</em>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor='muted'>Muted</label>
                            </th>
                            <td>
                                <input id='muted' type='checkbox' checked={muted} onChange={this.handleToggleMuted} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor='loop'>Loop</label>
                            </th>
                            <td>
                                <input id='loop' type='checkbox' checked={loop} onChange={this.handleToggleLoop} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor='light'>Light mode</label>
                            </th>
                            <td>
                                <input id='light' type='checkbox' checked={light} onChange={this.handleToggleLight} />
                            </td>
                        </tr>
                        <tr>
                            <th>Played</th>
                            <td><progress max={1} value={played} /></td>
                        </tr>
                        <tr>
                            <th>Loaded</th>
                            <td><progress max={1} value={loaded} /></td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <tbody>
                        <tr>
                            <th>url</th>
                            <td className={!url ? 'faded' : ''}>
                                {(url instanceof Array ? 'Multiple' : url) || 'null'}
                            </td>
                        </tr>
                        <tr>
                            <th>playing</th>
                            <td>{playing ? 'true' : 'false'}</td>
                        </tr>
                        <tr>
                            <th>volume</th>
                            <td>{volume.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <th>played</th>
                            <td>{played.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <th>loaded</th>
                            <td>{loaded.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <th>duration</th>
                            <td><Duration seconds={duration} /></td>
                        </tr>
                        <tr>
                            <th>elapsed</th>
                            <td><Duration seconds={duration * played} /></td>
                        </tr>
                        <tr>
                            <th>remaining</th>
                            <td><Duration seconds={duration * (1 - played)} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Player