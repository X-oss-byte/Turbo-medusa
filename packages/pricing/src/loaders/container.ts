import { ModulesSdkTypes } from "@medusajs/types"
import * as defaultRepositories from "@repositories"
import {
  BaseRepository,
  CurrencyRepository,
  MoneyAmountRepository,
  PriceListRepository,
} from "@repositories"
import { CurrencyService, MoneyAmountService, PriceListService } from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { loadCustomRepositories } from "@medusajs/utils"
import { asClass } from "awilix"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const customRepositories = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    currencyService: asClass(CurrencyService).singleton(),
    moneyAmountService: asClass(MoneyAmountService).singleton(),
    priceListService: asClass(PriceListService).singleton()
  })

  if (customRepositories) {
    loadCustomRepositories({
      defaultRepositories,
      customRepositories,
      container,
    })
  } else {
    loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(BaseRepository).singleton(),
    currencyRepository: asClass(CurrencyRepository).singleton(),
    moneyAmountRepository: asClass(MoneyAmountRepository).singleton(),
    priceListRepository: asClass(PriceListRepository).singleton(),
  })
}
