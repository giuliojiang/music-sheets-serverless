function ListItem(props) {
  const {d, index, selectedIndex, onSelect} = props;
  const element = React.useRef();
  React.useEffect(() => {
    if (index === selectedIndex) {
      if (element.current != null) {
        element.current.scrollIntoView();
      }
    }
  }, [index, selectedIndex]);
  return (
    <div ref={element} className={`list-link-container ${index === selectedIndex ? 'list-link-container-selected' : ''}`} key={d.name}>
      <a className="list-link" onClick={() => {
        onSelect(d);
      }}>{d.name}</a>
    </div>
  )
}

function List(props) {
  const onSelect = props.onSelect;

  const [data, setData] = React.useState(null);
  const dataLength = data == null ? 0 : data.length;
  React.useEffect(() => {
    (async () => {
      const request = await fetch(window.location.href + `list.json`);
      const response = await request.json();
      setData(response);
    })();
  }, []);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onPrev = React.useCallback(() => {
    setSelectedIndex(value => {
      if (value <= 0) {
        return value;
      } else {
        return value - 1;
      }
    })
  }, []);

  const onNext = React.useCallback(() => {
    setSelectedIndex(value => {
      if (value >= (dataLength - 1)) {
        return value;
      } else {
        return value + 1;
      }
    })
  }, [dataLength]);

  const onEnter = React.useCallback(() => {
    setSelectedIndex(value => {
      if (value >= 0 && value < dataLength && dataLength > 0) {
        onSelect(data[value]);
      }
      return value;
    })
  }, [data, dataLength]);

  const commandListener = React.useCallback(obj => {
    const cmd = obj.cmd;
    if (cmd == null) {
      return;
    }
    if (cmd === 'next') {
      onNext();
    }
    if (cmd === 'prev') {
      onPrev();
    }
    if (cmd === 'enter') {
      onEnter();
    }
  }, [onNext, onPrev, onEnter]);

  React.useEffect(() => {
    return registerCommandListener(commandListener);
  }, [commandListener]);

  React.useEffect(() => {
    document.onkeyup = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        onPrev();
      }
      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        onNext();
      }
      if (e.code === 'Enter') {
        onEnter();
      }
    }
    return () => {
      document.onkeyup = null;
    }
  }, [onPrev, onNext, onEnter]);

  return (
    data == null ? (
      <div>Loading...</div>
    ) : (
      data.map((d, index) => {
        return <ListItem key={index} {...{index, selectedIndex, d, onSelect}} />
      })
    )
  )
}