import { test, expect } from '@playwright/test';
import { VatCalculator } from '../pages/vatCalculatorPage';

const vatCalculatorUrl = 'en/vat-calculator';
const expectedTitle = "Value-Added Tax (VAT) Calculator";
const countries: string[] = ["Romania", "Spain", "Sweden", "Italy", "Austria"];
const romaniaRates: number[] = [5, 9, 19];
const country = "Romania";
const netPrice = 1000;
const vatRate = 5;

test.describe("Vat calculator tests", () => {
    let vatCalculator: VatCalculator;

    test.beforeEach(async ({page}) => {
        vatCalculator = new VatCalculator(page);
        await vatCalculator.navigateTo(vatCalculatorUrl);
        await vatCalculator.acceptConsent();
        const actualTitle = await vatCalculator.getTitle();
        expect(actualTitle).toBe(expectedTitle);
    });

    test("Change the vat country", async () => {
        await vatCalculator.vatCalculatorFormIsVisible();
        for (const country of countries) {
            await vatCalculator.selectCountryFromDropdown(country);
        }
    });

    test("User can change VAT Rate", async () => {
        await vatCalculator.selectCountryFromDropdown(country);
        for (const vat of romaniaRates) {
            await vatCalculator.countVatRates(romaniaRates.length);
            await vatCalculator.changeVatRate(vat);
        }
    });

    test("Reset button should reset all values", async () => {
        await vatCalculator.selectCountryFromDropdown(country);
        await vatCalculator.changeVatRate(vatRate);
        await vatCalculator.typePrice(netPrice);
        await vatCalculator.resetForm();
    });
})