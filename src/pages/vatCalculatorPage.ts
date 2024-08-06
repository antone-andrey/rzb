import { BasePage } from "./basePage";
import { expect, Locator, Page } from "@playwright/test";
import { calculateVatPrice } from "../utils/calculateVatPrices";

export class VatCalculator extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    vatCheckbox: Locator = this.page.locator('.css-radio[name="VAT"]');
    netPrice: Locator = this.page.locator("#NetPrice");
    vatPrice: Locator = this.page.locator("#VATsum");
    priceInclVat: Locator = this.page.locator("#Price");
    resetButton: Locator = this.page.getByRole('button', { name: 'Reset' });
    negativeValuesError: Locator = this.page.locator("#google-visualization-errors-8");

    private async selectVAT(vatNumber: number) {
        const VAT = this.page.getByText(`${vatNumber}%`, { exact: true });
        return VAT;
    }

    private async getCalculatorForm() {
        return this.page.locator('#vatcalculator');
    }

    async vatCalculatorFormIsVisible() {
       const calculatorForm = await this.getCalculatorForm();
       await expect(calculatorForm).toBeVisible();
    }

    private async getCountry() {
        return this.page.getByRole('combobox');
    }

    async selectCountryFromDropdown(countryOption: string) {
        const country = await this.getCountry();
        await country.selectOption(countryOption);
        await expect(country).toContainText(countryOption);
    }

    async acceptConsent(): Promise<void> {
        const consentButton = this.page.locator('[aria-label="Consent"]');
        expect(consentButton).toBeVisible();
        await consentButton.click();
    }

    async changeVatRate(VAT_RATE: number) {
       const VAT = await this.selectVAT(VAT_RATE);
       await VAT.click();
       expect(VAT).toBeChecked();
       expect(VAT).toHaveText(VAT_RATE.toString() + '%');
    }

    async countVatRates(VAT_RATES: number) {
       await expect(this.vatCheckbox).toHaveCount(VAT_RATES);
    }

    async calculatePrices(defaultPrice: number, vat: number) {
        const result = calculateVatPrice(defaultPrice, vat);
        let valueAddedTax = result.vatAmount;
        let princeIncludingVat = result.totalPrice;
        await this.netPrice.fill(defaultPrice.toString());

        const actualVatPrice = await this.vatPrice.inputValue();
        const actualFullPrice = await this.priceInclVat.inputValue();

        console.log(parseInt(actualVatPrice));
        expect(parseFloat(actualVatPrice)).toBe(valueAddedTax);
        expect(parseFloat(actualFullPrice)).toBe(princeIncludingVat);
    }

    async typePrice(vat: number) {
        await this.netPrice.fill(vat.toString());
        const price = await this.netPrice.inputValue({timeout:3000});
        expect(parseInt(price)).toBe(vat);
    }

    async resetForm() {
        let defaultVAT: number = 19;
        await this.resetButton.click();
        const price = await this.netPrice.inputValue({timeout:3000});
        expect(parseInt(price)).toBeNull; 
        expect(this.page.getByText(`${defaultVAT}%`)).toBeChecked();
    }

    // not shown
    async negativeValuesErrorIsShown() {
        expect(this.negativeValuesError).toBeVisible();
    }
}