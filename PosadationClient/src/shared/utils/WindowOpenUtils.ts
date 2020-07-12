import { DialogMessages } from '../dialogs/DialogMessages'
import { shouldMockApis } from './shouldMockApis'

export async function openNewWindow(url: string): Promise<void> {
  if (shouldMockApis()) {
    const result = await DialogMessages.yesNoDialog('Opening a new window! Click yes to open', url)
    if (result.value) {
      window.open(url)
    }

    return
  }

  window.open(url)
}
