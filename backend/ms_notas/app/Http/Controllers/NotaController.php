    <?php

    namespace App\Http\Controllers;

    use Illuminate\Http\Request;
    use App\Models\Nota;

    class NotaController extends Controller
    {
        /**
         * Display a listing of the resource.
         */
        public function index()
        {
            $rows = Nota::all();
            $data = ["data" => $rows];
            return response()->json($data, 200);
        }

        /**
         * Store a newly created resource in storage.
         */
        public function store(Request $request)
        {
            $dataBody = $request->all();
            $nota = new Nota();
            $nota->id = $dataBody['id'];
            $nota->actividad = $dataBody['actividad'];
            $nota->nota = $dataBody['nota'];
            $nota->codEstudiante = $dataBody['codEstudiante'];
            $nota->save();
            $data = ["data" => $nota];
            return response()->json($data, 201);
        }

        /**
         * Display the specified resource.
         */
        public function show(string $id)
        {
            $row = Nota::find($id);
            if (empty($row)) {
                return response()->json(["msg" => "error"], 404);
            }
            $data = ["data" => $row];
            return response()->json($data, 200);
        }

        /**
         * Update the specified resource in storage.
         */
        public function update(Request $request, string $id)
        {
            $dataBody = $request->all();
            $nota = Nota::find($id);
            $nota->id = $dataBody['id'];
            $nota->actividad = $dataBody['actividad'];
            $nota->nota = $dataBody['nota'];
            $nota->codEstudiante = $dataBody['codEstudiante'];
            $nota->save();
            $data = ["data" => $nota];
            return response()->json($data, 200);
        }

        /**
         * Remove the specified resource from storage.
         */
        public function destroy(string $id)
        {
            $row = Nota::find($id);
            if (empty($row)) {
                return response()->json(["msg" => "error no existe esa nota"], 404);
            }
            $row->delete();
            return response()->json(["data" => "Nota borrada"], 200);
        }
    }
