import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { getSuccessfulSignalEmbed } from '../../handlers/locale';
import { addSignal } from '../../api';
import { config } from '../../config';

class SignalCommand extends Command {
    constructor() {
        super({
            trigger: 'signal',
            description: 'Yapılandırılırsa bu, bir komutu saklayacak ve APImiz aracılığıyla kullanılabilir hale getirecektir.',
            type: 'ChatInput',
            module: 'information',
            args: [
                {
                    trigger: 'signal',
                    description: 'Hangi sinyali/komutu çalıştırmak istersiniz?',
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.signal,
                    value: true,
                }
            ]
        });
    }

    async run(ctx: CommandContext) {
        addSignal(ctx.args['signal']);
        return ctx.reply({ embeds: [ getSuccessfulSignalEmbed() ] });
    }
}

export default SignalCommand;
