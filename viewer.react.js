function Viewer(props) {
  const name = props.name;
  const files = props.files;
  const onBack = props.onBack;

  const [index, setIndex] = React.useState(0);

  const imagePath = window.location.href + `sheets/${name}/${files[index]}`;
  const prevImage = window.location.href + `sheets/${name}/${files[index - 1]}`;
  const nextImage = window.location.href + `sheets/${name}/${files[index + 1]}`;

  const onPrev = React.useCallback(() => {
    setIndex(oldIndex => {
      if (oldIndex > 0) {
        return oldIndex - 1;
      }
      return oldIndex;
    });
  }, []);

  const onNext = React.useCallback(() => {
    setIndex(oldIndex => {
      if (oldIndex < (files.length - 1)) {
        return oldIndex + 1;
      }
      return oldIndex;
    })
  }, []);

  React.useEffect(() => {
    document.onkeyup = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        onPrev();
      }
      if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        onNext();
      }
      if (e.code === 'Escape') {
        onBack();
      }
    }
    return () => {
      document.onkeyup = null;
    }
  }, [files, onBack, onPrev, onNext]);

  const onClick = React.useCallback((event) => {
    const screen = {
      x: window.innerWidth,
      y: window.innerHeight
    };
    const click = {
      x: event.pageX,
      y: event.pageY
    };

    if (click.y < (screen.y / 3)) {
      onBack();
    } else if (click.x < (screen.x / 2)) {
      onPrev();
    } else {
      onNext();
    }
  }, [onBack, onPrev, onNext]);

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
    if (cmd === 'escape') {
      onBack();
    }
  }, [onNext, onPrev, onBack]);

  React.useEffect(() => {
    return registerCommandListener(commandListener);
  }, [commandListener]);

  return (
    <div onClick={onClick} className="viewer-container">
      <img src={imagePath} key={imagePath} className="viewer-image" />
      <img src={prevImage} key={prevImage} className="viewer-image-hidden" />
      <img src={nextImage} key={nextImage} className="viewer-image-hidden" />
    </div>
  );
}