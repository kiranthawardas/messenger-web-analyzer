
import React from 'react'
import '../node_modules/react-vis/dist/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import utf8 from 'utf8'
import './style.css';
import * as d3 from 'd3-format'
import { Hint, XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, DiscreteColorLegend, VerticalBarSeriesCanvas } from 'react-vis';

const STOP_WORDS = new Set(["https", "http", "www", "com", "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"])
const PROTECTED_KEYWORDS = ["sent a photo", "sent an attachment", "sent a link", "sent a GIF", "created a poll"];

class WordFrequency extends React.Component {
    // All this stuff is pretty boilerplate except for the hintDatapoint state element which is used for this react-vis element
    constructor(props) {
        super(props);
        this.state = {
            hintDatapoint: null,
            barSeriesData: null,
            wordCountsPerSender: null,
            topWords: null,
        }
        this.renderPlot = this.renderPlot.bind(this);
        this.formatHint = this.formatHint.bind(this);
        this.renderHint = this.renderHint.bind(this);
        this.renderLegend = this.renderLegend.bind(this);
    }

    componentDidMount() {
        wordFreq(this, this.props.data);
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            wordFreq(this, this.props.data);
        }
    }

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
            <div className="visualization-with-legend">
                <XYPlot xType={'ordinal'}
                    stackBy="y"
                    onMouseLeave={() => {
                        this.setState({ hintDatapoint: null })
                    }}
                    width={window.innerWidth * 0.6}
                    height={window.innerHeight * 0.85}
                >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis tickFormat={tick => d3.format('.2s')(tick)} />
                    {this.renderPlot()}
                    {this.renderHint()}
                </XYPlot>
                {this.renderLegend()}
            </div>
        )
    }

    renderLegend() {
        if (this.state.wordCountsPerSender) {
            return (
                <DiscreteColorLegend
                    orientation={'vertical'}
                    width={window.innerWidth * 0.15}
                    height={window.innerHeight * 0.85}
                    items={Object.keys(this.state.wordCountsPerSender)}
                />
            )
        }
    }

    renderHint() {
        if (this.state.hintDatapoint) {
            return (
                <Hint value={this.state.hintDatapoint} format={this.formatHint} />
            )
        }
        else {
            return null;
        }
    }

    formatHint(datapoint) {
        let formattedHint = [
            {
                "title": "Word", "value": datapoint.x
            }
        ];
        let _this = this;
        let format = d3.format(",");
        Object.keys(this.state.wordCountsPerSender).forEach(function (sender) {
            if (!_this.state.wordCountsPerSender[sender][datapoint.x]) {
                formattedHint.push({
                    "title": sender,
                    "value": 0
                })
            }
            else {
                formattedHint.push({
                    "title": sender,
                    "value": format(_this.state.wordCountsPerSender[sender][datapoint.x])
                })
            }
        })
        return formattedHint
    }

    renderPlot() {
        if (!this.state.barSeriesData || !this.state.topWords) return null;
        let _this = this;
        return Object.keys(this.state.barSeriesData).map(function (sender) {
            return (
                <VerticalBarSeriesCanvas
                    key={sender}
                    data={_this.state.barSeriesData[sender]}
                    onNearestX={(datapoint) => {
                        if (!_this.state.hintDatapoint || datapoint.x !== _this.state.hintDatapoint.x) {
                            _this.setState({ hintDatapoint: datapoint })
                        }
                    }}
                />
            )
        })
    }
}

function wordFreq(_this, data) {
    if (data == null) return null;

    let wordCounts = {}; // map (word->count)
    let wordCountsPerSender = {}; // map (sender->word->count)
    data["messages"].forEach(function (message) {
        if (message["content"] && !containsProtectedWords(message["content"])) {
            const wordsArray = formatString(message["content"]).split(/\s+/);
            wordsArray.forEach(function (word) {
                let currentWord = word.trim().toLowerCase();
                if (!STOP_WORDS.has(word.toLowerCase()) && word !== "") {
                    let sender = message["sender_name"]

                    // attempt to decode emojis
                    try {
                        currentWord = utf8.decode(currentWord);
                    }
                    catch (err) {
                        currentWord = word.trim().toLowerCase();
                    }

                    if (!wordCounts[currentWord]) {
                        wordCounts[currentWord] = 0;
                    }
                    if (!wordCountsPerSender[sender]) {
                        wordCountsPerSender[sender] = {};
                    }
                    if (!wordCountsPerSender[sender][currentWord]) {
                        wordCountsPerSender[sender][currentWord] = 0;
                    }
                    wordCounts[currentWord]++;
                    wordCountsPerSender[sender][currentWord]++;
                }
            })
        }
    })
    // List of top 15 sorted words
    let topWords = sortTotals(wordCounts).slice(0, 15);

    let barSeriesData = transformData(topWords, wordCountsPerSender);

    _this.setState({
        topWords: topWords,
        wordCountsPerSender: wordCountsPerSender,
        barSeriesData: barSeriesData
    });
}

function transformData(topWords, wordCountsPerSender) {
    let barSeriesData = {};
    topWords.forEach(function (word) {
        Object.keys(wordCountsPerSender).forEach(function (sender) {
            if (!barSeriesData[sender]) {
                barSeriesData[sender] = [];
            }
            barSeriesData[sender].push({
                x: word,
                y: wordCountsPerSender[sender][word] ? wordCountsPerSender[sender][word] : 0
            })
        })
    })
    return barSeriesData;
}

function sortTotals(wordCounts) {
    return Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
}

function formatString(stringIn) {
    let formatString = stringIn.trim();
    formatString = formatString.replace(/https?:\/\/[^\s]+/g, " ")
    formatString = formatString.replace(/http?:\/\/[^\s]+/g, " ")
    formatString = formatString.replace(/[!"#$%&()*+,-./:;<=>?@[\]^_`{|}~]/g, " ")
    return formatString;
}

function containsProtectedWords(stringIn) {
    // return false;
    let retVal = false;
    PROTECTED_KEYWORDS.forEach(function (keyword) {
        if (stringIn.includes(keyword)) {
            if (stringIn.includes("just")) {
                console.log(stringIn);
            }
            retVal = true;
            return;
        }
    })
    return retVal;
}
export default WordFrequency;