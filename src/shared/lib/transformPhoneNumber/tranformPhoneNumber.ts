export function transformPhoneNumber(inputNumber: string): string {
	const digitsOnly = inputNumber.replace(/\D/g, "");
	return "+" + digitsOnly;
}
