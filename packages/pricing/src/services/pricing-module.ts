import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PricingTypes,
} from "@medusajs/types"
import { Currency, MoneyAmount, PriceList } from "@models"
import { CurrencyService, MoneyAmountService } from "@services"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  shouldForceTransaction,
} from "@medusajs/utils"

import { joinerConfig } from "../joiner-config"
import PriceListService from "./price-list"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  currencyService: CurrencyService<any>
  moneyAmountService: MoneyAmountService<any>
  priceListService: PriceListService<any>
}

export default class PricingModuleService<
  TMoneyAmount extends MoneyAmount = MoneyAmount,
  TPriceList extends PriceList = PriceList,
  TCurrency extends Currency = Currency
> implements PricingTypes.IPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly currencyService_: CurrencyService<TCurrency>
  protected readonly moneyAmountService_: MoneyAmountService<TMoneyAmount>
  protected readonly priceListService_: PriceListService<TPriceList>

  constructor(
    {
      baseRepository,
      moneyAmountService,
      currencyService,
      priceListService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.currencyService_ = currencyService
    this.moneyAmountService_ = moneyAmountService
    this.priceListService_ = priceListService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config: FindConfig<PricingTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.MoneyAmountDTO> {
    const moneyAmount = await this.moneyAmountService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO>(
      moneyAmount,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async list(
    filters: PricingTypes.FilterableMoneyAmountProps = {},
    config: FindConfig<PricingTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.MoneyAmountDTO[]> {
    const moneyAmounts = await this.moneyAmountService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
      moneyAmounts,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: PricingTypes.FilterableMoneyAmountProps = {},
    config: FindConfig<PricingTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.MoneyAmountDTO[], number]> {
    const [moneyAmounts, count] = await this.moneyAmountService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
        moneyAmounts,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(
    data: PricingTypes.CreateMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const moneyAmounts = await this.moneyAmountService_.create(
      data,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
      moneyAmounts,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async update(
    data: PricingTypes.UpdateMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const moneyAmounts = await this.moneyAmountService_.update(
      data,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
      moneyAmounts,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.moneyAmountService_.delete(ids, sharedContext)
  }

  @InjectManager("baseRepository_")
  async retrieveCurrency(
    code: string,
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.CurrencyDTO> {
    const currency = await this.currencyService_.retrieve(
      code,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO>(currency, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listCurrencies(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.CurrencyDTO[]> {
    const currencies = await this.currencyService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
      currencies,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountCurrencies(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.CurrencyDTO[], number]> {
    const [currencies, count] = await this.currencyService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
        currencies,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createCurrencies(
    data: PricingTypes.CreateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const currencies = await this.currencyService_.create(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
      currencies,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateCurrencies(
    data: PricingTypes.UpdateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const currencies = await this.currencyService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
      currencies,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteCurrencies(
    currencyCodes: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.currencyService_.delete(currencyCodes, sharedContext)
  }


  @InjectManager("baseRepository_")
  async retrievePriceList(
    code: string,
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const priceList = await this.priceListService_.retrieve(
      code,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO>(priceList, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listPriceLists(
    filters: PricingTypes.FilterablePriceListProps = {},
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.priceListService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountPriceLists(
    filters: PricingTypes.FilterablePriceListProps = {},
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.PriceListDTO[], number]> {
    const [currencies, count] = await this.priceListService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
        currencies,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createPriceLists(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const priceLists = await Promise.all(data.map(async (priceList) => {
      const { prices, ...rest } = priceList
      const [createdPriceList] = await this.priceListService_.create(rest, sharedContext)

      const moneyAmounts = await this.moneyAmountService_.addPriceListPrices(
        createdPriceList.id,
        prices
      )

      createdPriceList.prices = moneyAmounts

      return createdPriceList
    }))

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updatePriceLists(
    data: PricingTypes.UpdatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const priceLists = await this.priceListService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deletePriceLists(
    currencyCodes: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceListService_.delete(currencyCodes, sharedContext)
  }
}
