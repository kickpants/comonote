import styles from "../../styles/Loader.module.css";

const Bar = ({ animationDuration, progress }) => {
  return (
    <div
      className={styles.domload}
      style={{
        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `margin-left ${animationDuration}ms linear`,
      }}
    ></div>
  );
};

export default Bar;