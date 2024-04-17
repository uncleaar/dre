import { describe, expect, it } from "vitest";

import { transformPhoneNumber } from "./tranformPhoneNumber.ts";

describe("it should be format", () => {
	it("should transform a simple phone number with digits only", () => {
		const inputNumber = "+1 (123) 456-7890";
		const result = transformPhoneNumber(inputNumber);
		expect(result).toBe("+11234567890");
	});

	it("should transform a phone number with spaces and special characters", () => {
		const inputNumber = "(555) 123-4567";
		const result = transformPhoneNumber(inputNumber);
		expect(result).toBe("+5551234567");
	});

	it("should handle an empty input", () => {
		const inputNumber = "";
		const result = transformPhoneNumber(inputNumber);
		expect(result).toBe("+");
	});

	it("should handle an input with no digits", () => {
		const inputNumber = "abc-xyz";
		const result = transformPhoneNumber(inputNumber);
		expect(result).toBe("+");
	});
});
