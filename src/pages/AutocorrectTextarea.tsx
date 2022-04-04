import React from 'react';

const corrections = {
  'xy': 'x',
  'y': 'z',
  'abc': 'bc',
};

class AutocorrectTextarea extends React.Component {
  state = {
    input: ''
  }

  getInput = () => this.state.input

  handlerInput = val => {
    let text = val.target.value

    if (text[text.length - 1] === ' ') {
      const aux = text.slice(' ')
      console.log();
      
      Object.entries(corrections).forEach(o => {
        text = text.replace(`${o[0]} `, `${o[1]} `)
      })
    }
    
    this.setState({
      input: text
    })
  }

  render() {
    return (
      <div className="text-center">
        <textarea onChange={this.handlerInput} value={this.getInput()} data-testid="textarea" rows={10} cols={80} className="card" />
      </div>
    );
  }
}

export default AutocorrectTextarea;
