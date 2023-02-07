<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TransactionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            ['40194756', '50000', '1', '3', 'hello world', '2023-02-03 06:31:23', '2023-02-05 06:31:23', "NULL"],
            ['54329409', '50000', '1', '4', 'hello world', '2023-01-02 03:59:15', '2023-01-07 03:59:15', 'NULL'],
            ['55234667', '50000', '1', '4', 'hello world', '2023-01-07 03:59:16', '2023-01-07 03:59:16', 'NULL'],
            ['64756247', '50000', '3', '1', 'hello world', '2023-01-23 03:59:14', '2023-01-07 03:59:14', 'NULL'],
            ['78183049', '50000', '3', '1', 'hello world', '2023-01-21 03:58:55', '2023-01-07 03:58:55', 'NULL'],
            ['78183049', '50000', '3', '1', 'hello world', '2023-01-31 03:58:55', '2023-01-07 03:58:55', 'NULL'],
            ['78183049', '50000', '1', '4', 'hello world', '2023-01-31 03:58:55', '2023-01-08 03:58:55', 'NULL'],
            ['78183049', '50000', '1', '4', 'hello world', '2023-01-02 03:58:55', '2023-01-07 03:58:55', 'NULL'],
            ['78183049', '50000', '1', '4', 'hello world', '2023-01-01 03:58:55', '2023-01-07 03:58:55', 'NULL'],
            ['78183049', '50000', '3', '1', 'hello world', '2023-01-30 03:58:55', '2023-01-07 03:58:55', 'NULL'],
            ['78183049', '50000', '3', '1', 'hello world', '2023-02-01 03:58:55', '2023-01-07 03:58:55', 'NULL'],
            ['78183049', '50000', '1', '4', 'hello world', '2023-01-31 03:58:55', '2023-01-07 03:58:55', 'NULL'],
        ];

        foreach ($users as $user) {
            Transaction::create([
                'code' => $user[0],
                'amount' => $user[1],
                'from_id' => $user[2],
                'to_id' => $user[3],
                'message' => $user[4],
                'created_at' => $user[5],
                'title' => $user[6],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
