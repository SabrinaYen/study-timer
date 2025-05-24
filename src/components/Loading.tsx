import { FC } from "react";
import LoadingGIF from "../../public/assets/loading.gif";
import styles from "../app/page.module.css";
interface IsLoadingType {
  isLoading?: boolean;
}
const Loading: FC<IsLoadingType> = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <div className={styles.loading}>
          <img src={LoadingGIF.src} alt="loading" />.
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Loading;
