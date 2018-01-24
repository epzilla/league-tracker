import { Component } from 'preact';
import Toggle from './toggle';
import Autocomplete from './autocomplete';

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], headers: [] };
  }

  componentWillReceiveProps({ data, headers, autoSaveRow, rowSaveCallback }) {
    let autoCompleteValues = {};
    headers.forEach(h => {
      if (h.type === 'autocomplete') {
        data.forEach((d, i) => {
          autoCompleteValues[`${h.name}${i}`] = d[h.name];
        });
      }
    })
    this.setState({ data, headers, autoCompleteValues });
  }

  changed = (e, i, header) => {
    let data = this.state.data;
    data[i][header.name] = e.target.value;
    if (header.type === 'number') {
      data[i][header.name] = parseInt(data[i][header.name]);
    }
    this.setState({ data }, () => {
      if (this.props.autoSaveRow) {
        this.props.rowSaveCallback(data[i], i, data);
      }
    });
  };

  autocompleteChanged = (item, i, header) => {
    let state = this.state;
    let key = `${header.name}${i}`;
    state.autoCompleteValues[key] = item.val;
    state.data[i][header.name] = item.val;
    this.setState(state, () => {
      if (this.props.autoSaveRow) {
        this.props.rowSaveCallback(state.data[i], i, state.data);
      }
    });
  };

  focus = (e) => {
    e.target.select();
  };

  toggled = (field, i) => {
    let data = this.state.data;
    data[i][field] = !data[i][field];
    this.setState({ data }, () => {
      if (this.props.autoSaveRow) {
        this.props.rowSaveCallback(data[i], i, data);
      }
    });
  };

  deleteRow = (i) => {
    let data = this.state.data
    let deletedRow = data.splice(i, 1)[0];
    this.setState({ data }, () => {
      if (this.props.rowDeleteCallback) {
        this.props.rowDeleteCallback(i, deletedRow);
      }
    });
  };

  render() {
    let headers = this.state.headers.map(header => {
      return <th class="title-case">{header.title ? header.title : header.name}</th>;
    });

    if (this.props.deleteButton) {
      headers.push(<th></th>);
    }

    let rows = this.state.data.map((d, i) => {
      let cells = this.state.headers.map(header => {
        if (header.type === 'select') {
          return (
            <td class="align-center">
              <select onChange={(e) => this.changed(e, i, header)}>
                {
                  header.options.map(opt => {
                    return <option value={opt} selected={opt === d[header.name]}>{opt}</option>
                  })
                }
              </select>
            </td>
          )
        }

        if (header.type === 'boolean') {
          return <td class="flex-center"><Toggle id={`${header.name}-${i}`} toggled={(e) => this.toggled(e, i)} onOff={d[header.name]} property={header.name} /></td>
        }
        else if (header.type === 'autocomplete') {
          return (
            <td>
              <Autocomplete
                value={d[header.name]}
                options={header.items}
                onSelect={(item) => this.autocompleteChanged(item, i, header)}
                renderItems={header.render}
              />
            </td>
          )
        }

        return <td><input onFocus={this.focus} value={d[header.name]} type={header.type} onChange={(e) => this.changed(e, i, header)} /></td>
      });

      if (this.props.deleteButton) {
        cells.push(<td><button class="delete-btn" onClick={() => this.deleteRow(i)}>&times;</button></td>);
      }
      return <tr>{ cells }</tr>;
    });

    let classNames = this.props.class ? this.props.class : '';

    return(
      <table class={`editable-table ${classNames}`}>
        <thead>
          { headers }
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    );
  }
}