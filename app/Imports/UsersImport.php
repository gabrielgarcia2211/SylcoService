<?php

namespace App\Imports;

use App\Http\Controllers\StorageController;
use App\Models\Proyecto;
use App\Models\Proyecto_User;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;




class UsersImport implements ToModel,WithHeadingRow,WithValidation,WithChunkReading,WithBatchInserts
{
    use Importable,SkipsFailures, SkipsErrors;

    private $driveData;
    private $id;


    function __construct()
    {
        $this->driveData = new StorageController();
    }

    public function model(array $row)
    {


        $proyecto = strtoupper($row['proyecto']);
        $data_name = Proyecto::where('name', $proyecto)->first();

        if(empty($data_name)) {
            $proyecto_id = Proyecto::create([
                'name' => $proyecto,
                'descripcion' => 'descripcion 1',
                'ubicacion' => 'calle 1'
            ]);

            $this->id = $proyecto_id->id;
        }


        /*CONTRATISTA*/
        $user_contratista = User::create([
            'nit' => $row['cedula_representante'],
            'name' => strtoupper($row['nombre_del_representante_legal']),
            'last_name' => strtoupper($row['apellido_del_representante_legal']),
            'email' => $row['correo_representante_legal'],
            'password' => Hash::make('12345'),
        ]);


        Proyecto_User::create([
            'user_nit' => $user_contratista->nit,
            'proyecto_id' => (empty($data_name)) ? $this->id : $data_name->id,
        ]);

        $user_contratista->assignRole('Contratista');

        $this->driveData->createDirectory(strtoupper($user_contratista->name));



    }

    public function rules(): array
    {
        return [
            'correo_representante_legal' => 'required|unique:users,email',
            'cedula_representante' => 'required|unique:users,nit',
            'nombre_del_representante_legal' => 'required|unique:users,name',
        ];
    }


    public function headingRow(): int
    {
        return 3;
    }



    public function batchSize(): int
    {
        return 1;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
