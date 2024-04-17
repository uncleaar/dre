import { ReactElement, useEffect, useState } from "react";

export const BugButton = (): ReactElement => {
	const [error, setError] = useState(false);

	const onThrowErrorClick = () => setError(true);

	useEffect(() => {
		if (error) {
			throw new Error();
		}
	}, [error]);

	return <button onClick={onThrowErrorClick}>throw error</button>;
};
