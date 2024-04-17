import { memo, ReactElement } from "react";
import { classNames } from "shared/lib/classNames";

import { IPageErrorProps } from "./interfaces";

import styles from "./PageError.module.scss";

export const PageError = memo(({ className = "" }: IPageErrorProps): ReactElement => {
	const onReloadPageClick = () => location.reload();

	return (
		<div className={classNames(styles.pageError, {}, [className])}>
			<p>Error</p>
			<button onClick={onReloadPageClick}>Reload page</button>
		</div>
	);
});
