import { Command } from '@oclif/command'

import { isEmptyCommand } from '../../helpers/checkCommandInputs'
import { config } from '../../helpers/config'
import { loadABI } from '../../helpers/utils'

export class AddCommand extends Command {
  static description = 'Add a known ABI'

  static args = [
    {
      name: 'name',
      required: false,
      description: 'Name of the ABI to add',
    },
    {
      name: 'abiPath',
      required: false,
      description: 'Path to the file with the ABI',
    },
  ]

  static examples = ['eth abi:add erc777 ./path/to/erc777.json']

  async run() {
    const { args, flags } = this.parse(AddCommand)

    if (isEmptyCommand(flags, args)) {
      this._help()
      this.exit(1)
    }

    try {
      const { name, abiPath } = args

      const abis = config.get('abis', {})
      const abi = loadABI(abiPath)
      if (abis[name]) {
        this.warn(`ABI '${name}' already exists. Use abi:update if you want to modify it.`)
      } else {
        abis[name] = abi
        config.set('abis', abis)
      }
    } catch (e) {
      this.error(e.message, { exit: 1 })
    }
  }
}
