<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColToTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('order_id')->nullable();
        });
        
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->string('payment_type')->nullable();
            $table->string('payment_status')->nullable();
            $table->unsignedBigInteger('shared_user_id')->nullable();
            $table->unsignedBigInteger('share_amount')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->dropColumn(['payment_type', 'payment_status', 'shared_user_id', 'share_amount']);
        });
    }
}
