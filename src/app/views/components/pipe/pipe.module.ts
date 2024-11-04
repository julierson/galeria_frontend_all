// Angular
import { NgModule } from '@angular/core';

// Formatação # Os pipes são um recurso muito utilizado no Angular para formatar a exibição de valores corretamente
import { FormatarCpf } from './formatarcpf.pipe';
import { FormatarTelefone } from './formatartelefone.pipe';
import { FormatarValor } from './FormatarValor.pipe';
import { FormatarJuro } from './formatarjuro.pipe';
import { FormatarData } from './formatardata.pipe';
import { FormatarDataTime } from './formatardatatime.pipe';
import { FilterPipe } from './filter.pipe';
import { CutPipe } from './Cut.pipe';
import { FormatarNome } from './FormatarNome.pipe';
import { SizeConversionPipe } from './SizeConversion.pipe';

@NgModule({
  imports: [

  ],

  declarations: [
    FormatarCpf,
    FormatarTelefone,
    FormatarValor,
    FormatarJuro,
    FormatarData,
    FormatarDataTime,
    FilterPipe,
    CutPipe,
    FormatarNome,
    SizeConversionPipe,
  ],

  providers: [],
  exports: [
    FormatarCpf,
    FormatarTelefone,
    FormatarValor,
    FormatarJuro,
    FormatarData,
    FormatarDataTime,
    FilterPipe,
    CutPipe,
    FormatarNome,
    SizeConversionPipe,
  ]
})

export class PipeModule {}
