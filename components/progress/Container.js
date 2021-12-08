import styles from "../../styles/Loader.module.css";

const Container = ({ animationDuration, children, isFinished }) => {
  return (
    <div
      className={styles.pointernone}
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      {children}
    </div>
  );
};

export default Container;
