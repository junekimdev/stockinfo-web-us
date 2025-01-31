import styles from './charts.module.scss';

const View = () => {
  const bars: React.JSX.Element[] = [];
  for (let i = 0; i < 10; i++) {
    const bar = (
      <div
        key={`placeholder-bar-${i}`}
        className={styles.bar}
        style={{ height: `${10 + Math.floor(Math.random() * 60)}%` }}
      ></div>
    );
    bars.push(bar);
  }

  return (
    <div className={styles.placeholder}>
      <div className={styles.barWrapper}>{bars}</div>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default View;
