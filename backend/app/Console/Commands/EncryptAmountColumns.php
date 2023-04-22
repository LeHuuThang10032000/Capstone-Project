<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class EncryptAmountColumns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'encrypt:amount-columns';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Encrypts all amount columns in the database.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $transactions = DB::table('transactions')->whereIn('id', [452, 453, 454, 457])->get();
        foreach($transactions as $transaction) {
            DB::table('transactions')
                ->where('id', $transaction->id)
                ->update([
                    'message' => Crypt::encryptString($transaction->message),
                    'amount' => Crypt::encryptString($transaction->amount),
                ]);
        }

        $this->info('All amount, code, message columns in the transactions table have been encrypted.');
    }
}
